import * as isoly from "isoly"
import * as authly from "authly"
import { Capture } from "../Capture"
import * as acquirer from "../index"
import { Refund } from "../Refund"
import { Card } from "./Card"
import { Merchant } from "./Merchant"

export interface Authorization {
	merchant: Merchant | { id: authly.Identifier }
	authorization: {
		id: string
		amount: number
		currency: isoly.Currency
		card: Card
		created: isoly.DateTime
		descriptor?: string
		number?: string
		reference?: string
		captured?: { amount: number; latest: isoly.DateTime; auto?: true }
		refunded?: { amount: number; latest: isoly.DateTime }
		voided?: isoly.DateTime
		recurring?: "initial" | "subsequent"
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
			typeof value.authorization.amount == "number" &&
			isoly.Currency.is(value.authorization.currency) &&
			Card.is(value.authorization.card) &&
			isoly.DateTime.is(value.authorization.created) &&
			(value.authorization.descriptor == undefined || typeof value.authorization.descriptor == "string") &&
			(value.authorization.number == undefined || typeof value.authorization.number == "string") &&
			(value.authorization.reference == undefined || typeof value.authorization.reference == "string") &&
			(value.authorization.captured == undefined ||
				(typeof value.authorization.captured == "object" &&
					typeof value.authorization.captured.amount == "number" &&
					isoly.DateTime.is(value.authorization.captured.latest))) &&
			(value.authorization.refunded == undefined ||
				(typeof value.authorization.refunded == "object" &&
					typeof value.authorization.refunded.amount == "number" &&
					isoly.DateTime.is(value.authorization.refunded.latest))) &&
			(value.authorization.voided == undefined || isoly.DateTime.is(value.authorization.voided)) &&
			(value.authorization.recurring == undefined ||
				["initial", "subsequent"].includes(value.authorization.recurring)) &&
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
				captured: fromHistory(authorization.capture),
				refunded: fromHistory(authorization.refund),
				voided: authorization.void,
				recurring: authorization.recurring,
			},
			created: authorization.created,
		}
	}
	function fromHistory(
		history: (Capture | Refund)[]
	): { amount: number; latest: isoly.DateTime; auto?: true } | undefined {
		return history.length == 0
			? undefined
			: history.reduce<{ amount: number; latest: isoly.DateTime; auto?: true }>(
					(r, c) => {
						return {
							amount: r.amount + c.amount,
							latest: r.latest < c.created ? c.created : r.latest,
							auto: Capture.is(c) && c.auto ? c.auto : r.auto,
						}
					},
					{ amount: 0, latest: "" }
			  )
	}
}
