import * as isoly from "isoly"
import * as selectively from "selectively"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Merchant as AcquirerMerchant } from "../Merchant"
import { Statistics } from "../Statistics"

export interface Merchant {
	id: authly.Identifier
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
			authly.Identifier.is(value.id) &&
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
			id: merchant.id,
			descriptor: merchant.descriptor ?? merchant.name,
			country: merchant.country,
			name: merchant.name,
			currency: merchant.currency,
			scheme: Object.keys(merchant.reconciliation.fees).filter(model.Card.Scheme.is),
			refundable: Statistics.refundable(statistics),
			captured: calculate(statistics.captured, limit),
			settled: calculate(statistics.settled, limit),
			fees: calculate(statistics.fees, limit),
		}
	}
	export const template = new selectively.Type.Object({
		id: new selectively.Type.String(),
		descriptor: new selectively.Type.String(),
		country: new selectively.Type.Union(isoly.CountryCode.Alpha2.types.map(c => new selectively.Type.String(c))),
		name: new selectively.Type.String(),
		currency: new selectively.Type.Union(isoly.Currency.types.map(c => new selectively.Type.String(c))),
		scheme: new selectively.Type.Array([
			new selectively.Type.Union([
				new selectively.Type.String("unknown"),
				new selectively.Type.String("amex"),
				new selectively.Type.String("dankort"),
				new selectively.Type.String("diners"),
				new selectively.Type.String("discover"),
				new selectively.Type.String("electron"),
				new selectively.Type.String("interpayment"),
				new selectively.Type.String("jcb"),
				new selectively.Type.String("maestro"),
				new selectively.Type.String("mastercard"),
				new selectively.Type.String("unionpay"),
				new selectively.Type.String("visa"),
			]),
		]),
		refundable: new selectively.Type.Number(),
		captured: new selectively.Type.Number(),
		settled: new selectively.Type.Number(),
		fees: new selectively.Type.Number(),
	})
}
function calculate(values: Record<isoly.DateTime, number>, limit: isoly.DateTime): number {
	return Object.entries(values).reduce((r, c) => r + (c[0] > limit ? c[1] : 0), 0)
}
