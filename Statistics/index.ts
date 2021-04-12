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
			Object.entries(value.refunded).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.refunded == "number" &&
			Object.entries(value.settled).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.fees == "object" &&
			Object.entries(value.fees).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.fees == "number" &&
			Object.entries(value.reserves).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.reserves == "number"
		)
	}
	export function refundable(statistics: Statistics): number {
		return 0
	}

	export function sum(record: Record<isoly.Date, number>, from?: isoly.Date | number, to?: isoly.Date): number {
		if (typeof from == "number") {
			const date = new Date()
			date.setDate(date.getDate() - (from ?? 0))
			from = isoly.Date.create(date)
		}
		return Object.entries(record).reduce(
			(r, e) => ((!from || e[0] >= from) && e[0] <= (to ?? isoly.Date.now()) ? (r += e[1]) : r),
			0
		)
	}
}
