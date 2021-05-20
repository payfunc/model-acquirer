import * as isoly from "isoly"
import * as authly from "authly"
import { Settlement } from "../Settlement"
export interface Statistics {
	merchant: authly.Identifier
	currency: isoly.Currency
	captured: Record<isoly.Date, number>
	refunded: Record<isoly.Date, number>
	settled: Record<isoly.Date, number>
	fees: Record<isoly.Date, number>
	reserves: { in: Record<isoly.Date, number>; out: Record<isoly.Date, number> }
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
	export function initialize(id: string, currency: isoly.Currency): Statistics {
		return { merchant: id, currency, captured: {}, refunded: {}, settled: {}, fees: {}, reserves: { in: {}, out: {} } }
	}
	export function merge(
		input: Statistics[],
		merchant: string,
		currency: isoly.Currency,
		rate: Record<string, number>
	): Statistics {
		const result: Statistics = initialize(merchant, currency)
		const types: ("captured" | "refunded" | "settled" | "fees")[] = ["captured", "refunded", "settled", "fees"]
		for (const statistic of input) {
			const factor = rate[statistic.currency] ?? 1
			for (const key of types)
				for (const entry of Object.entries(statistic[key]))
					result[key][entry[0]] = (result[key][entry[0]] ?? 0) + entry[1] * factor
			for (const entry of Object.entries(statistic.reserves.in))
				result.reserves.in[entry[0]] = result.reserves.in[entry[0]] + entry[1] * factor
			for (const entry of Object.entries(statistic.reserves.out))
				result.reserves.out[entry[0]] = result.reserves.out[entry[0]] + entry[1] * factor
		}
		return result
	}
	export function applySettlement(statistic: Statistics, date: string, settlement: Settlement): Statistics {
		statistic.fees[date] = typeof settlement.fee == "object" ? settlement.fee.total : settlement.fee
		statistic.settled[date] = settlement.net
		statistic.reserves.in[date] = settlement.reserve?.amount ?? 0
		if (settlement.reserve?.payout)
			statistic.reserves.out[settlement.reserve.payout] =
				(statistic.reserves.out[settlement.reserve.payout] ?? 0) - settlement.reserve.amount
		return statistic
	}

	export function refundable(statistics: Statistics): number {
		return isoly.Currency.round(
			sum(statistics.captured, undefined, 1) - sum(statistics.refunded, undefined, 1) + sum(statistics.reserves.in),
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
			reserves:
				sum(statistics.reserves.in, statistics.currency, from, to) +
				sum(statistics.reserves.out, statistics.currency, from, to),
		}
	}
}
