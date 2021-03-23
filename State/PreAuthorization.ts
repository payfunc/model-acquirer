import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import { Authorization } from "../Authorization"
import { Merchant as AcquirerMerchant } from "../Merchant"
import { Statistics } from "../Statistics"
import { lastDayOfMonth } from "./index"
import { Merchant } from "./Merchant"

export interface PreAuthorization {
	merchant: Merchant
	authorization: {
		amount: number
		currency: isoly.Currency
		card: Omit<model.Card, "expires"> & { expires: isoly.Date; csc?: "present" }
		capture?: "auto"
		descriptor?: string
		verification?: "verified" | "unavailable" | "rejected"
		recurring?: "initial" | "subsequent"
	}
	now: isoly.Date
}
export namespace PreAuthorization {
	export function is(value: PreAuthorization): value is PreAuthorization {
		return (
			typeof value == "object" &&
			Merchant.is(value.merchant) &&
			typeof value.authorization == "object" &&
			typeof value.authorization.amount == "number" &&
			isoly.Currency.is(value.authorization.currency) &&
			typeof value.authorization.card == "object" &&
			model.Card.Scheme.is(value.authorization.card.scheme) &&
			typeof value.authorization.card.iin == "string" &&
			value.authorization.card.iin.length == 6 &&
			typeof value.authorization.card.last4 == "string" &&
			value.authorization.card.last4.length == 4 &&
			isoly.Date.is(value.authorization.card.expires) &&
			(value.authorization.card.type == undefined || model.Card.Type.is(value.authorization.card.type)) &&
			typeof value.authorization.descriptor == "string" &&
			Array.isArray(value.authorization.card.scheme) &&
			value.authorization.card.scheme.every(model.Card.Scheme.is) &&
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
				card: convertCard(authorization.card),
				capture: authorization.capture,
				descriptor: authorization.descriptor,
				verification,
				recurring: authorization.recurring,
			},
			now: isoly.Date.now(),
		}
	}
	function convertCard(
		card: model.Card.Creatable
	): Omit<model.Card, "expires"> & { expires: isoly.Date; csc?: "present" } {
		return {
			scheme: model.Card.Pan.scheme(card.pan),
			iin: model.Card.Pan.iin(card.pan),
			last4: model.Card.Pan.last4(card.pan),
			expires:
				(2000 + card.expires[1]).toString() +
				"-" +
				card.expires[0].toString().padStart(2, "0") +
				"-" +
				lastDayOfMonth(2000 + card.expires[1], card.expires[0]),
			csc: card.csc ? "present" : undefined,
		}
	}
}
