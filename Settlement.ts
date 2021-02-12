import * as isoly from "isoly"
import * as authly from "authly"
import { Merchant } from "./Merchant"

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
	transactions: {
		authorization: authly.Identifier
		reference: string
		type: Merchant.Operation
		created: isoly.Date
		gross: number
		fee: number
		net: number
	}[]
}
