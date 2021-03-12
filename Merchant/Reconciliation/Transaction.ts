import * as isoly from "isoly"
import { Account } from "../Account"

export interface Transaction {
	from: Account
	to: Account
	amount: number
	currency: isoly.Currency
	schedule: isoly.Date | "hold"
	reference: string
	merchant: string
}

export namespace Transaction {
	export function is(value: any | Transaction): value is Transaction {
		return (
			typeof value == "object" &&
			Account.is(value.from) &&
			Account.is(value.to) &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			(isoly.Date.is(value.schedule) || value.schedule == "hold") &&
			typeof value.reference == "string"
		)
	}
	export function toCsv(transactions: Transaction[]): string {
		let result = "from,to,amount,currency,schedule,settlement,merchant\r\n"
		for (const value of transactions)
			result += `"${value.from}","${value.to}","${value.amount}","${value.currency}","${value.schedule}","${value.reference}","${value.merchant}"\r\n`
		return result
	}
}
