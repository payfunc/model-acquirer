import * as isoly from "isoly"
import { Authorization } from "../Authorization"
import { Capture } from "../Capture"
import { clear } from "../index"
import { Merchant as AcquirerMerchant } from "../Merchant"
import { Refund } from "../Refund"
import { Statistics } from "../Statistics"
import { Card } from "./Card"
import { Merchant } from "./Merchant"

export interface PostAuthorization {
	merchant: Merchant
	amount: number
	authorization: {
		amount: number
		currency: isoly.Currency
		card: Card
		created: isoly.DateTime
		number?: string
		captured?: { amount: number; latest: isoly.DateTime; auto?: true }
		refunded?: { amount: number; latest: isoly.DateTime }
		voided?: isoly.DateTime
		recurring?: "initial" | "subsequent"
	}
	descriptor?: string
	now: isoly.Date
}
export namespace PostAuthorization {
	export function is(value: PostAuthorization | any): value is PostAuthorization {
		return (
			typeof value == "object" &&
			Merchant.is(value.merchant) &&
			typeof value.amount == "number" &&
			typeof value.authorization == "object" &&
			typeof value.authorization.amount == "number" &&
			isoly.Currency.is(value.authorization.currency) &&
			Card.is(value.authorization.card) &&
			isoly.DateTime.is(value.authorization.created) &&
			(value.authorization.number == undefined || typeof value.authorization.number == "string") &&
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
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			isoly.Date.is(value.now)
		)
	}
	export function from(
		authorization: Authorization,
		creatable: (Capture.Creatable | Refund.Creatable) & { amount: number },
		merchant: AcquirerMerchant,
		statistics: Statistics,
		rate?: Record<string, number>
	): PostAuthorization {
		const factor =
			rate && merchant.reconciliation.currency != authorization.currency ? rate[authorization.currency] ?? 1 : 1
		return clear<PostAuthorization>({
			merchant: Merchant.from(merchant, statistics),
			amount: isoly.Currency.round(creatable.amount * factor, merchant.reconciliation.currency),
			authorization: {
				amount: isoly.Currency.round(authorization.amount * factor, merchant.reconciliation.currency),
				currency: authorization.currency,
				card: Card.from(authorization.card),
				created: authorization.created,
				number: authorization.number,
				captured: fromHistory(authorization.capture),
				refunded: fromHistory(authorization.refund),
				voided: authorization.void,
				recurring: authorization.recurring,
			},
			descriptor: authorization.descriptor,
			now: isoly.Date.now(),
		})
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
