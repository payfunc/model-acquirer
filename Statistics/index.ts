import * as isoly from "isoly"
import * as authly from "authly"

export interface Statistics {
	merchant: authly.Identifier
	currency: isoly.Currency
	captured: Record<isoly.Date, number>
	refunded: Record<isoly.Date, number>
	settled: Record<isoly.Date, number>
	fees: Record<isoly.Date, number>
	reserves: Record<isoly.Date, number>
}

export namespace Statistics {
	export function is(value: any | Statistics): value is Statistics {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.merchant, 8) &&
			isoly.Currency.is(value.currency) &&
			typeof value.captured == "object" &&
			Object.entries(value.captured).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.settled == "object" &&
			Object.entries(value.settled).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.refunded == "object" &&
			Object.entries(value.refunded).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.fees == "object" &&
			Object.entries(value.fees).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.reserves == "object" &&
			Object.entries(value.reserves).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number")
		)
	}
	export function refundable(statistics: Statistics, from?: isoly.Date | number, to?: isoly.Date): number {
		if (typeof from == "number") {
			const date = new Date()
			date.setDate(date.getDate() - (from ?? 0))
			from = isoly.Date.create(date)
		}
		return isoly.Currency.round(
			sum(statistics.captured, undefined, from ?? 1, to) -
				sum(statistics.refunded, undefined, from ?? 1, to) +
				sum(statistics.reserves),
			statistics.currency
		)
	}
	export function sum(
		record: Record<isoly.Date, number>,
		currency?: isoly.Currency,
		from?: isoly.Date | number,
		to?: isoly.Date
	): number {
		if (typeof from == "number") {
			const date = new Date()
			date.setDate(date.getDate() - (from ?? 0))
			from = isoly.Date.create(date)
		}
		const result = Object.entries(record).reduce(
			(r, e) => ((!from || e[0] >= from) && e[0] <= (to ?? isoly.Date.now()) ? (r += e[1]) : r),
			0
		)
		return !currency ? result : isoly.Currency.round(result, currency)
	}
	export function summarize(
		statistics: Statistics,
		from?: isoly.Date | number,
		to?: isoly.Date
	): {
		merchant: authly.Identifier
		currency: isoly.Currency
		captured: number
		refunded: number
		settled: number
		fees: number
		reserves: number
	} {
		return {
			...statistics,
			captured: sum(statistics.captured, statistics.currency, from, to),
			refunded: sum(statistics.refunded, statistics.currency, from, to),
			settled: sum(statistics.settled, statistics.currency, from, to),
			fees: sum(statistics.fees, statistics.currency, from, to),
			reserves: sum(statistics.reserves, statistics.currency, from, to),
		}
	}
}
