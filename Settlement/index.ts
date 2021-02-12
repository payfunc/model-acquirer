import * as isoly from "isoly"
import * as authly from "authly"
import { Transaction } from "./Transaction"

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
	transactions: Transaction[]
}
