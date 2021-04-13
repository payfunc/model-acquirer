import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import { Merchant as AcquirerMerchant } from "../Merchant"
import { Statistics } from "../Statistics"

export interface Merchant {
	descriptor: string
	country: isoly.CountryCode.Alpha2
	name: string
	currency: isoly.Currency
	scheme: model.Card.Scheme[]
	refundable: number
	captured: number
	settled: number
	fees: number
}
export namespace Merchant {
	export function is(value: any | Merchant): value is Merchant {
		return (
			typeof value == "object" &&
			typeof value.descriptor == "string" &&
			isoly.CountryCode.Alpha2.is(value.country) &&
			typeof value.name == "string" &&
			isoly.Currency.is(value.currency) &&
			Array.isArray(value.scheme) &&
			value.scheme.every(model.Card.Scheme.is) &&
			typeof value.refundable == "number" &&
			typeof value.captured == "number" &&
			typeof value.settled == "number" &&
			typeof value.fees == "number"
		)
	}
	export function from(merchant: AcquirerMerchant, statistics: Statistics): Merchant {
		const limit = isoly.Date.create(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30))
		return {
			descriptor: merchant.descriptor ?? merchant.name,
			country: merchant.country,
			name: merchant.name,
			currency: merchant.reconciliation.currency,
			scheme: Object.keys(merchant.reconciliation.fees).filter(model.Card.Scheme.is),
			refundable: Statistics.refundable(statistics),
			captured: calculate(statistics.captured, limit),
			settled: calculate(statistics.settled, limit),
			fees: calculate(statistics.fees, limit),
		}
	}
}
function calculate(values: Record<isoly.DateTime, number>, limit: isoly.DateTime): number {
	return Object.entries(values).reduce((r, c) => r + (c[0] > limit ? c[1] : 0), 0)
}
