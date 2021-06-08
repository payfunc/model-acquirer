import * as isoly from "isoly"
import * as authly from "authly"
import { Authorization } from "../Authorization"
import { clear } from "../index"
import { Card } from "./Card"
import { Merchant } from "./Merchant"

export interface FailedAuthorization {
	merchant: Merchant | { id: authly.Identifier }
	authorization: {
		id?: string
		number: string
		amount?: number
		currency?: isoly.Currency
		card?: Card
		capture?: "auto"
		descriptor?: string
		recurring?: Authorization.Recurring
		verification?: "verified" | "unavailable" | "rejected"
		status: "failed"[]
		history: Authorization.History[]
		reason: string
		created: isoly.DateTime
	}
}
export namespace FailedAuthorization {
	export function is(value: any | FailedAuthorization): value is FailedAuthorization {
		return (
			typeof value == "object" &&
			(Merchant.is(value.merchant) || (typeof value.merchant == "object" && authly.Identifier.is(value.merchant.id))) &&
			typeof value.authorization == "object" &&
			(value.authorization.id == undefined || typeof value.authorization.id == "string") &&
			typeof value.authorization.number == "string" &&
			(value.authorization.amount == undefined || typeof value.authorization.amount == "number") &&
			(value.authorization.currency == undefined || isoly.Currency.is(value.authorization.currency)) &&
			(value.authorization.card == undefined || Card.is(value.authorization.card)) &&
			(value.authorization.capture == undefined || value.authorization.capture == "auto") &&
			(value.authorization.descriptor == undefined || typeof value.authorization.descriptor == "string") &&
			(value.authorization.recurring == undefined || Authorization.Recurring.is(value.authorization.recurring)) &&
			[undefined, "verified", "unavailable", "rejected"].includes(value.authorization.verification) &&
			Array.isArray(value.authorization.status) &&
			value.authorization.status.every((s: any) => s == "failed") &&
			typeof value.authorization.reason == "string" &&
			isoly.DateTime.is(value.authorization.created) &&
			Array.isArray(value.authorization.history) &&
			value.authorization.history.every(Authorization.History.is)
		)
	}
	export function from(history: Authorization.History[]): FailedAuthorization {
		const result: FailedAuthorization = {
			merchant: { id: history[0].merchant },
			authorization: { status: ["failed"], created: "", reason: "", number: history[0].number, history },
		}
		for (const entry of history.sort((a, b) => (a.date > b.date ? 1 : -1))) {
			result.authorization.amount = "amount" in entry ? entry.amount : result.authorization.amount
			result.authorization.currency = "currency" in entry ? entry.currency : result.authorization.currency
			result.authorization.descriptor = "descriptor" in entry ? entry.descriptor : result.authorization.descriptor
			result.authorization.card = "card" in entry && entry.card ? Card.from(entry.card) : result.authorization.card
			result.authorization.recurring = "recurring" in entry ? entry.recurring : result.authorization.recurring
			result.authorization.reason = "reason" in entry ? entry.reason : result.authorization.reason
			result.authorization.created = entry.date
			result.authorization.verification =
				"verification" in entry ? entry.verification : result.authorization.verification
		}
		return clear<FailedAuthorization>(result)
	}
}
