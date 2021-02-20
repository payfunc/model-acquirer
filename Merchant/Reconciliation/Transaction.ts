import * as isoly from "isoly"
import { Account } from "../Account"

export interface Transaction {
	from: Account
	to: Account
	amount: number
	currency: isoly.Currency
	date: isoly.Date
	reference: string
}

export namespace Transaction {
	export function is(value: any | Transaction): value is Transaction {
		return (
			typeof value == "object" &&
			Account.is(value.from) &&
			Account.is(value.to) &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			isoly.Date.is(value.date) &&
			typeof value.reference == "string"
		)
	}
}