import * as isoly from "isoly"
import * as authly from "authly"
import { Merchant } from "../Merchant"

export interface Transaction {
	authorization: authly.Identifier
	reference: string
	type: Merchant.Operation
	created: isoly.Date
	gross: number
	fee: number
	net: number
}
