import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import { Authorization } from "../Authorization"
import { Merchant as AcquirerMerchant } from "../Merchant"
import { Statistics } from "../Statistics"
import { Card } from "./Card"
import { Merchant } from "./Merchant"

export interface PreAuthorization {
	merchant: Merchant
	authorization: {
		amount: number
		currency: isoly.Currency
		card: Card & { csc?: "present" }
		capture?: "auto"
		descriptor?: string
		verification?: "verified" | "unavailable" | "rejected"
		recurring?: "initial" | "subsequent"
	}
	now: isoly.Date
}
export namespace PreAuthorization {
	export function is(value: any | PreAuthorization): value is PreAuthorization {
		return (
			typeof value == "object" &&
			Merchant.is(value.merchant) &&
			typeof value.authorization == "object" &&
			typeof value.authorization.amount == "number" &&
			isoly.Currency.is(value.authorization.currency) &&
			Card.is(value.authorization.card) &&
			(value.authorization.card.csc == undefined || value.authorization.card.csc == "present") &&
			(value.authorization.capture == undefined || value.authorization.capture == "auto") &&
			(value.authorization.descriptor == undefined || typeof value.authorization.descriptor == "string") &&
			(value.authorization.verification == undefined ||
				["verified", "unavailable", "rejected"].includes(value.authorization.verification)) &&
			(value.authorization.recurring == undefined ||
				["initial", "subsequent"].includes(value.authorization.recurring)) &&
			typeof value.now == "string"
		)
	}
	export function from(
		authorization: Authorization.Creatable & { card: model.Card.Creatable },
		merchant: AcquirerMerchant,
		statistics: Statistics,
		verification?: "verified" | "unavailable" | "rejected",
		rate?: Record<isoly.Currency, number>
	): PreAuthorization {
		const factor = rate ? rate[authorization.currency] ?? 1 : 1
		return {
			merchant: Merchant.from(merchant, statistics),
			authorization: {
				amount: isoly.Currency.round(authorization.amount * factor, merchant.reconciliation.currency),
				currency: authorization.currency,
				card: Card.from(authorization.card),
				capture: authorization.capture,
				descriptor: authorization.descriptor,
				verification,
				recurring: authorization.recurring,
			},
			now: isoly.Date.now(),
		}
	}
}
