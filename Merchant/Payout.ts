import * as isoly from "isoly"
import { Account } from "./Account"
// Moving money from an account to another account, needs toCSV function
export interface Payout {
	from: Account
	to: Account
	amount: number
	currency: isoly.Currency
	date: isoly.Date
	reference: string
}

export namespace Payout {
	export function is(value: any | Payout): value is Payout {
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
