import * as gracely from "gracely"
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
	currency: isoly.Currency
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
			isoly.Currency.is(value.currency) &&
			typeof value.gross == "number" &&
			(typeof value.fee == "number" ||
				(typeof value.fee == "object" && typeof value.fee.scheme == "number" && typeof value.fee.total == "number")) &&
			typeof value.net == "number" &&
			(value.reserve == undefined ||
				(typeof value.reserve == "object" &&
					typeof value.reserve.amount == "number" &&
					(value.reserve.payout == undefined || isoly.Date.is(value.reserve.payout))))
		)
	}

	export function flaw(value: Transaction | any): gracely.Flaw {
		return {
			type: "Transaction",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							authly.Identifier.is(value.authorization) || { property: "authorization", type: "authly.Identifier" },
							typeof value.reference == "string" || { property: "reference", type: "string" },
							Merchant.Operation.is(value.type) || { property: "type", type: "Merchant.Operation" },
							["debit", "credit"].includes(value.card) || { property: "card", type: '"debit" | "credit"' },
							model.Card.Scheme.is(value.scheme) || { property: "scheme", type: "model.Card.Scheme" },
							isoly.CountryCode.Alpha2.is(value.area) || { property: "area", type: "isoly.CountryCode.Alpha2" },
							isoly.Date.is(value.created) || { property: "created", type: "isoly.Date" },
							isoly.Currency.is(value.currency) || { property: "currency", type: "isoly.Currency" },
							typeof value.gross == "number" || { property: "gross", type: "number" },
							typeof value.fee == "number" ||
								(typeof value.fee == "object" &&
									typeof value.fee.scheme == "number" &&
									typeof value.fee.total == "number") || {
									property: "fee",
									type: "number | { scheme: number; total: number }",
								},
							typeof value.net == "number" || { property: "net", type: "number" },
							value.reserve == undefined ||
								(typeof value.reserve == "object" &&
									typeof value.reserve.amount == "number" &&
									(value.reserve.payout == undefined || isoly.Date.is(value.reserve.payout))) || {
									property: "reserve",
									type: "{amount: number, payout?: isoly.Date}",
								},
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}

	export function toCsv(transactions: Transaction[]): string {
		let result =
			"authorization,reference,type,card,scheme,area,created,currency,gross,fee,net,reserve amount,reserve payout\r\n"
		for (const value of transactions)
			result += `"${value.authorization}","${value.reference}","${value.type}","${value.card}","${value.scheme}","${
				value.area
			}","${value.created}","${value.currency}","${value.gross}","${
				typeof value.fee == "number" ? value.fee : value.fee.total
			}","${value.net}","${value.reserve?.amount}","${value.reserve?.payout}"\r\n`
		return result
	}
	export function toCustomer(value: Transaction): Transaction
	export function toCustomer(value: Transaction[]): Transaction[]
	export function toCustomer(value: Transaction | Transaction[]): Transaction | Transaction[] {
		return Array.isArray(value)
			? value.map(t => toCustomer(t))
			: { ...value, fee: typeof value.fee == "object" ? value.fee.total : value.fee }
	}
}
