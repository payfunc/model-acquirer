import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Merchant } from "../Merchant"

export interface Transaction {
	authorization: authly.Identifier
	reference: string
	type: Merchant.Operation
	card: "debit" | "credit"
	scheme: model.Card.Scheme
	area: isoly.CountryCode.Alpha2
	created: isoly.Date
	gross: number
	fee: number
	net: number
}

export namespace Transaction {
	export function is(value: any | Transaction): value is Transaction {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.authorization) &&
			typeof value.reference == "string" &&
			Merchant.Operation.is(value.type) &&
			(value.card == "debit" || value.card == "credit") &&
			model.Card.Scheme.is(value.scheme) &&
			isoly.CountryCode.Alpha2.is(value.area) &&
			isoly.Date.is(value.created) &&
			typeof value.gross == "number" &&
			typeof value.fee == "number" &&
			typeof value.net == "number"
		)
	}
}
