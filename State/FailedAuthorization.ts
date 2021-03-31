import * as isoly from "isoly"
import * as authly from "authly"
import { Log } from "@payfunc/model-log"
import { Card } from "./Card"
import { Merchant } from "./Merchant"

export interface FailedAuthorization {
	merchant?: Merchant | authly.Identifier
	authorization: {
		amount?: number
		currency?: isoly.Currency
		card?: Partial<Card> & { csc?: "present" }
		capture?: "auto"
		descriptor?: string
		number?: string
		verification?: "verified" | "unavailable" | "rejected"
		recurring?: "initial" | "subsequent"
	}
	log: Log[]
	reason: string
	created: isoly.DateTime
	now?: isoly.Date
}
export namespace FailedAuthorization {
	export function is(value: any | FailedAuthorization): value is FailedAuthorization {
		return (
			typeof value == "object" &&
			(value.merchant == undefined || Merchant.is(value.merchant) || authly.Identifier.is(value.merchant)) &&
			typeof value.authorization == "object" &&
			(value.authorization.amount == undefined || typeof value.authorization.amount == "number") &&
			(value.authorization.currency == undefined || isoly.Currency.is(value.authorization.currency)) &&
			(value.authorization.card == undefined ||
				(Card.isPartial(value.authorization.card) &&
					(value.authorization.card.csc == undefined || value.authorization.card.csc == "present"))) &&
			(value.authorization.capture == undefined || value.authorization.capture == "auto") &&
			(value.authorization.descriptor == undefined || typeof value.authorization.descriptor == "string") &&
			(value.authorization.number == undefined || typeof value.authorization.number == "string") &&
			(value.authorization.verification == undefined ||
				["verified", "unavailable", "rejected"].includes(value.authorization.verification)) &&
			(value.authorization.recurring == undefined ||
				["initial", "subsequent"].includes(value.authorization.recurring)) &&
			Array.isArray(value.log) &&
			value.log.every(Log.is) &&
			typeof value.reason == "string" &&
			(value.created == undefined || isoly.DateTime.is(value.created)) &&
			(value.now == undefined || typeof value.now == "string")
		)
	}
}
