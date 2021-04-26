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
	fee: number | { scheme: number; total: number }
	net: number
	reserve?: { amount: number; payout?: isoly.Date }
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
			(typeof value.fee == "number" || (typeof value.fee.scheme == "number" && typeof value.fee.total == "number")) &&
			typeof value.net == "number" &&
			typeof value.reserve == "object" &&
			typeof value.reserve.amount == "number" &&
			(value.reserve.payout == undefined || isoly.Date.is(value.reserve.payout))
		)
	}
	export function toCsv(transactions: Transaction[]): string {
		let result = "authorization,reference,type,card,scheme,area,created,gross,fee,net,reserve amount,reserve payout\r\n"
		for (const value of transactions)
			result += `"${value.authorization}","${value.reference}","${value.type}","${value.card}","${value.scheme}","${
				value.area
			}","${value.created}","${value.gross}","${typeof value.fee == "number" ? value.fee : value.fee.total}","${
				value.net
			}","${value.reserve?.amount}","${value.reserve?.amount}"\r\n`
		return result
	}

	export function toCustomer(transactions: Transaction[]): Transaction[] {
		return transactions.map(t => {
			return { ...t, fee: typeof t.fee == "object" ? t.fee.total : t.fee }
		})
	}
}
