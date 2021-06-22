import * as gracely from "gracely"
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

	export function flaw(value: Settlement | any): gracely.Flaw {
		return {
			type: "Settlement",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.reference == "string" || { property: "reference", type: "string" },
							authly.Identifier.is(value.merchant) || { property: "merchant", type: "authly.Identifier" },
							(typeof value.period == "object" &&
								isoly.Date.is(value.period.start) &&
								isoly.Date.is(value.period.end)) || {
								property: "period",
								type: "{start: isoly.Date, end: isoly.Date}",
							},
							value.payout == undefined ||
								isoly.Date.is(value.payout) || { property: "payout", type: "isoly.Date | undefined" },
							value.reserve == undefined ||
								(typeof value.reserve == "object" &&
									typeof value.reserve.amount == "number" &&
									(value.reserve.payout == undefined || isoly.Date.is(value.reserve.payout))) || {
									property: "reserve",
									type: "{amount: number, payout?: isoly.Date}",
								},
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
							value.transactions.every(SettlementTransaction.is) || { property: "transactions", type: "Transaction[]" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}

	export function toContact(value: Settlement): Settlement
	export function toContact(value: Settlement[]): Settlement[]
	export function toContact(value: Settlement | Settlement[]): Settlement | Settlement[] {
		return Array.isArray(value)
			? value.map(s => toContact(s))
			: {
					...value,
					transactions: SettlementTransaction.toContact(value.transactions),
					fee: typeof value.fee == "object" ? value.fee.total : value.fee,
			  }
	}
}
