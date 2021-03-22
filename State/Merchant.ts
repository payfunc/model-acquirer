import * as isoly from "isoly"
import * as model from "@payfunc/model-card"

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
