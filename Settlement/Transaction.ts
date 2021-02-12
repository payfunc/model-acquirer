import * as isoly from "isoly"
import * as authly from "authly"
import { Merchant } from "../Merchant"

export interface Transaction {
	authorization: authly.Identifier
	reference: string
	type: Merchant.Operation
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
			isoly.Date.is(value.created) &&
			typeof value.gross == "number" &&
			typeof value.fee == "number" &&
			typeof value.net == "number"
		)
	}
}
