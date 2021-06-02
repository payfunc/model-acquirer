import * as isoly from "isoly"
import * as authly from "authly"
import { Log } from "@payfunc/model-log"
import { Authorization } from "../Authorization"
import { Card } from "./Card"
import { Merchant } from "./Merchant"
import { PreAuthorization } from "./PreAuthorization"

export interface FailedAuthorization {
	merchant: Merchant | { id: authly.Identifier }
	authorization: {
		id?: string
		number?: string
		amount?: number
		currency?: isoly.Currency
		card?: Card
		capture?: "auto"
		descriptor?: string
		recurring?: "initial" | "subsequent"
		verification?: "verified" | "unavailable" | "rejected"
		status: "failed"[]
		reason: string
		created: isoly.DateTime
	}
	log: Log[]
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
			(value.authorization.created == undefined || isoly.DateTime.is(value.authorization.created)) &&
			Array.isArray(value.log) &&
			value.log.every(Log.is)
		)
	}
	export function from(logs: Log[]): FailedAuthorization {
		const result: FailedAuthorization = {
			merchant: { id: "" },
			authorization: { status: ["failed"], created: "", reason: "" },
			log: logs,
		}
		for (const log of logs) {
			const update = log.created > result.authorization.created && log.reference?.type == "authorization"
			if (update) {
				const state = log.entries.find(e => e.point == "PreAuthorization State")?.data.state
				result.authorization = state?.authorization?.number ? state.authorization : { number: log.reference?.number }
				result.authorization.created = log.created
				result.authorization.status = ["failed"]
				result.merchant = { id: log.merchant }
				const response = log.entries.find(e => e.point == "response")?.data.body
				result.authorization.reason =
					(response.details && response.details.message) ??
					(response.content &&
						(response.content.description && response.content.description.length <= 30
							? response.content.description
							: response.content.type)) ??
					response.type ??
					"unknown failure"
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
