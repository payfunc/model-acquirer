import * as isoly from "isoly"
import * as authly from "authly"
import * as acquirer from "../index"
import { Card } from "./Card"
import { Merchant } from "./Merchant"

export interface Authorization {
	merchant: Merchant | { id: authly.Identifier }
	authorization: {
		id: string
		number?: string
		reference: string
		created: isoly.DateTime
		amount: number
		currency: isoly.Currency
		card: Card
		descriptor?: string
		recurring?: "initial" | "subsequent"
		history: acquirer.Authorization.Change[]
		capture: acquirer.Capture[]
		refund: acquirer.Refund[]
		voided?: isoly.DateTime
		status: Partial<Record<acquirer.Authorization.Status, number>>
	}
	created: isoly.DateTime
}

export namespace Authorization {
	export function is(value: any | Authorization): value is Authorization {
		return (
			typeof value == "object" &&
			(Merchant.is(value.merchant) || (typeof value.merchant == "object" && authly.Identifier.is(value.merchant.id))) &&
			typeof value.authorization == "object" &&
			typeof value.authorization.id == "string" &&
			(value.authorization.number == undefined || typeof value.authorization.number == "string") &&
			typeof value.authorization.reference == "string" &&
			isoly.DateTime.is(value.authorization.created) &&
			typeof value.authorization.amount == "number" &&
			isoly.Currency.is(value.authorization.currency) &&
			Card.is(value.authorization.card) &&
			(value.authorization.descriptor == undefined || typeof value.authorization.descriptor == "string") &&
			(value.authorization.recurring == undefined ||
				["initial", "subsequent"].includes(value.authorization.recurring)) &&
			Array.isArray(value.authorization.history) &&
			value.authorization.history.every(acquirer.Authorization.Change.is) &&
			Array.isArray(value.authorization.capture) &&
			value.authorization.capture.every(acquirer.Capture.is) &&
			Array.isArray(value.authorization.refund) &&
			value.authorization.refund.every(acquirer.Refund.is) &&
			(value.authorization.voided == undefined || isoly.DateTime.is(value.authorization.voided)) &&
			typeof value.authorization.status == "object" &&
			Object.entries(value.authorization.status).every(
				entry => acquirer.Authorization.Status.is(entry[0]) && typeof entry[1] == "string"
			) &&
			isoly.DateTime.is(value.created)
		)
	}
	export function from(
		authorization: acquirer.Authorization,
		merchant: acquirer.Merchant | { id: string },
		statistics?: acquirer.Statistics
	): Authorization {
		return {
			merchant:
				statistics && acquirer.Merchant.is(merchant) ? Merchant.from(merchant, statistics) : { id: merchant.id },
			authorization: {
				id: authorization.id,
				amount: authorization.amount,
				currency: authorization.currency,
				card: Card.from(authorization.card),
				created: authorization.created,
				descriptor: authorization.descriptor,
				number: authorization.number,
				reference: authorization.reference,
				history: authorization.history,
				capture: authorization.capture,
				refund: authorization.refund,
				voided: authorization.void,
				recurring: authorization.recurring,
				status: authorization.status,
			},
			created: authorization.created,
		}
	}
}
