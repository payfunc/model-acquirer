import * as isoly from "isoly"
import { Account } from "./Account"
// Moving money from an account to another account, needs toCSV function
export interface Transaction {
	from: Account
	to: Account
	amount: number
	currency: isoly.Currency
	date: isoly.Date
	reference: string
}
