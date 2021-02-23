import * as isoly from "isoly"
import * as authly from "authly"

export interface Statistics {
	merchant: authly.Identifier
	currency: isoly.Currency
	captured: Record<isoly.Date, number>
	settled: Record<isoly.Date, number>
	fees: Record<isoly.Date, number>
	refundable: number
}

export namespace Statistics {
	export function is(value: any | Statistics): value is Statistics {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.merchant) &&
			isoly.Currency.is(value.currency) &&
			typeof value.captured == "object" &&
			Object.entries(value.captured).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.settled == "object" &&
			Object.entries(value.settled).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.fees == "object" &&
			Object.entries(value.fees).every(e => isoly.Date.is(e[0]) && typeof e[1] == "number") &&
			typeof value.fees == "number"
		)
	}
	export function sum(record: Record<isoly.Date, number>, days?: number): number {
		const date = new Date()
		date.setDate(date.getDate() - (days ?? 0))
		const result = Object.entries(record).reduce(
			(r, e) => (!days || isoly.Date.parse(e[0]) >= date ? (r += e[1]) : r),
			0
		)
		return result
	}
}
