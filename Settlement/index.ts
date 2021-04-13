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
	reserve?: { amount: number; payout?: isoly.Date }
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
	export function toCsv(settlements: Settlement[]): string {
		let result = "reference,merchant,start date,end date,payout date,created,gross,fee,net,currency\r\n"
		for (const value of settlements) {
			result += `"${value.reference}","${value.merchant}","${value.period.start}","${value.period.end}","${value.payout}","${value.created}","${value.gross}","${value.fee}","${value.net}","${value.currency}"\r\n`
			result += value.transactions.length > 0 ? SettlementTransaction.toCsv(value.transactions) : ""
		}
		return result
	}
}
