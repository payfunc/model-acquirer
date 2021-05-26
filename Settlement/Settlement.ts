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
			(value.reserve == undefined ||
				(typeof value.reserve == "object" &&
					typeof value.reserve.amount == "number" &&
					(value.reserve.payout == undefined || isoly.Date.is(value.reserve.payout)))) &&
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
