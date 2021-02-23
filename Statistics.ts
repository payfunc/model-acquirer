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
			Object.entries(value.captured).every(o => isoly.Date.is(o[0]) && typeof o[1] == "number") &&
			typeof value.settled == "object" &&
			Object.entries(value.settled).every(o => isoly.Date.is(o[0]) && typeof o[1] == "number") &&
			typeof value.fees == "object" &&
			Object.entries(value.fees).every(o => isoly.Date.is(o[0]) && typeof o[1] == "number") &&
			typeof value.fees == "number"
		)
	}
}
