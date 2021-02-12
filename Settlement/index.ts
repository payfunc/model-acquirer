import * as isoly from "isoly"
import * as authly from "authly"
import { Transaction as SettlementTransaction } from "./Transaction"

export interface Settlement {
	reference: string
	merchant: authly.Identifier
	period: {
		start: isoly.Date
		end: isoly.Date
	}
	payout?: isoly.Date
	created: isoly.Date
	gross: number
	fee: number
	net: number
	currency: isoly.Currency
	transactions: SettlementTransaction[]
}

export namespace Settlement {
	export function is(value: any | Settlement): value is Settlement {
		return (
			typeof value == "object" &&
			typeof value.reference == "string" &&
			authly.Identifier.is(value.merchant) &&
			typeof value.period == "object" &&
			isoly.Date.is(value.period.start) &&
			isoly.Date.is(value.period.end) &&
			(value.payout == undefined || isoly.Date.is(value.payout)) &&
			isoly.Date.is(value.created) &&
			typeof value.gross == "number" &&
			typeof value.fee == "number" &&
			typeof value.net == "number" &&
			isoly.Currency.is(value.currency) &&
			Array.isArray(value.transactions) &&
			value.transactions.every(SettlementTransaction.is)
		)
	}
	export type Transaction = SettlementTransaction
	export namespace Transaction {
		export const is = SettlementTransaction.is
	}
}
