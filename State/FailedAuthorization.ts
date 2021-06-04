import * as isoly from "isoly"
import * as authly from "authly"
import { Log } from "@payfunc/model-log"
import { Authorization } from "../Authorization"
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
		status: ("failed" | "pending")[]
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
			(value.authorization.number == undefined || typeof value.authorization.number == "string") &&
			(value.authorization.amount == undefined || typeof value.authorization.amount == "number") &&
			(value.authorization.currency == undefined || isoly.Currency.is(value.authorization.currency)) &&
			(value.authorization.card == undefined || Card.is(value.authorization.card)) &&
			(value.authorization.capture == undefined || value.authorization.capture == "auto") &&
			(value.authorization.descriptor == undefined || typeof value.authorization.descriptor == "string") &&
			(value.authorization.recurring == undefined ||
				["initial", "subsequent"].includes(value.authorization.recurring)) &&
			(value.authorization.verification == undefined ||
				["verified", "unavailable", "rejected"].includes(value.authorization.verification)) &&
			value.authorization.status.every((s: any) => s == "failed") &&
			typeof value.authorization.reason == "string" &&
			(value.authorization.created == undefined || isoly.DateTime.is(value.authorization.created))
		)
	}
	export function from(history: Authorization.History[]): FailedAuthorization {
		const result: FailedAuthorization = {
			merchant: { id: history[0].merchant },
			authorization: { status: ["failed"], created: "", reason: "", number: history[0].number },
		}
		for (const entry of history) {
			const update = entry.date > result.authorization.created
			if (update) {
				result.authorization.amount = "amount" in entry ? entry.amount : result.authorization.amount
				result.authorization.currency = "currency" in entry ? entry.currency : result.authorization.currency
				result.authorization.card = "card" in entry && entry.card ? Card.from(entry.card) : result.authorization.card
				result.authorization.recurring = "recurring" in entry ? entry.recurring : result.authorization.recurring
				result.authorization.reason = "reason" in entry ? entry.reason : result.authorization.reason
				result.authorization.created = entry.date
				result.authorization.status = entry.status == "fail" ? ["failed"] : ["pending"]
				result.authorization.verification =
					"verification" in entry ? entry.verification : result.authorization.verification
				result.authorization.amount = "amount" in entry ? entry.amount : result.authorization.amount
				result.authorization.amount = "amount" in entry ? entry.amount : result.authorization.amount
				result.authorization.amount = "amount" in entry ? entry.amount : result.authorization.amount
				result.authorization.amount = "amount" in entry ? entry.amount : result.authorization.amount
				// id?: string
				// capture?: "auto"
				// descriptor?: string
				// verification?: "verified" | "unavailable" | "rejected"
			}
		}
		return result
	}
	export function load(authorizations: Authorization[], logs: Log[]): FailedAuthorization[] {
		const registry: Record<string, Log[]> = {}
		for (const log of logs)
			if (
				log.reference?.number &&
				["authorization", "verification"].includes(log.reference.type) &&
				authorizations.every(a => log.reference?.id != a.id && log.reference?.number != a.number)
			)
				registry[log.reference.number] = [...(registry[log.reference.number] ?? []), log]
		return Object.values(registry).map(from)
	}
}
