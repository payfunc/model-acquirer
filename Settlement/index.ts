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
	currency: isoly.Currency
	gross: number
	fee: number | { scheme: number; total: number }
	net: number
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
			typeof value.reserve == "object" &&
			typeof value.reserve.amount == "number" &&
			(value.reserve.payout == undefined || isoly.Date.is(value.reserve.payout)) &&
			isoly.Date.is(value.created) &&
			isoly.Currency.is(value.currency) &&
			typeof value.gross == "number" &&
			(typeof value.fee == "number" ||
				(typeof value.fee == "object" && typeof value.fee.scheme == "number" && typeof value.fee.total == "number")) &&
			typeof value.net == "number" &&
			Array.isArray(value.transactions) &&
			value.transactions.every(SettlementTransaction.is)
		)
	}
	export type Transaction = SettlementTransaction
	export namespace Transaction {
		export const is = SettlementTransaction.is
		export const toCustomer = SettlementTransaction.toCustomer
	}
	export function toCsv(settlements: Settlement[]): string {
		let result =
			"reference,merchant,start date,end date,payout date,reserve amount,reserve payout,created,gross,fee,net,currency\r\n"
		for (const value of settlements) {
			result += `"${value.reference}","${value.merchant}","${value.period.start}","${value.period.end}","${
				value.payout
			}","${value.reserve?.amount}","${value.reserve?.payout}","${value.created}","${value.gross}","${
				typeof value.fee == "number" ? value.fee : value.fee.total
			}","${value.net}","${value.currency}"\r\n`
			result += value.transactions.length > 0 ? SettlementTransaction.toCsv(value.transactions) : ""
		}
		return result
	}
	export function toCustomer(value: Settlement): Settlement
	export function toCustomer(value: Settlement[]): Settlement[]
	export function toCustomer(value: Settlement | Settlement[]): Settlement | Settlement[] {
		return Array.isArray(value)
			? value.map(s => toCustomer(s))
			: {
					...value,
					transactions: SettlementTransaction.toCustomer(value.transactions),
					fee: typeof value.fee == "object" ? value.fee.total : value.fee,
			  }
	}
}
