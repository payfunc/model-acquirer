import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Change as AChange } from "./Change"
import { Creatable as ACreatable } from "./Creatable"

export interface Authorization {
	id: authly.Identifier
	number?: string
	reference: string
	created: isoly.DateTime
	amount: number
	currency: isoly.Currency
	card: model.Card
	descriptor?: string
	history: AChange[]
	capture: Capture[]
	refund: Refund[]
	void?: isoly.DateTime
}

export namespace Authorization {
	export function is(value: Authorization | any): value is Authorization {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id, 16) &&
			(value.number == undefined || typeof value.number == "string") &&
			typeof value.reference == "string" &&
			isoly.DateTime.is(value.created) &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			model.Card.is(value.card) &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			Array.isArray(value.history) &&
			value.history.every(AChange.is) &&
			Array.isArray(value.capture) &&
			value.capture.every(Capture.is) &&
			Array.isArray(value.refund) &&
			value.history.every(Refund.is) &&
			(value.void == undefined || isoly.DateTime.is(value.void))
		)
	}
	export function flaw(value: Authorization | any): gracely.Flaw {
		return {
			type: "Authorization",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							authly.Identifier.is(value.id) || { property: "id", type: "authly.Identifier" },
							value.number == undefined || typeof value.number == "string" || { property: "", type: "" },
							typeof value.reference == "string" || { property: "reference", type: "string" },
							isoly.DateTime.is(value.created) || { property: "created", type: "isoly.DateTime" },
							typeof value.amount == "number" || { property: "amount", type: "number" },
							isoly.Currency.is(value.currency) || { property: "currency", type: "isoly.Currency" },
							model.Card.is(value.card) || { property: "card", type: "model.Card" },
							value.descriptor == undefined ||
								typeof value.descriptor == "string" || { property: "descriptor", type: "string | undefined" },
							value.history == undefined ||
								(Array.isArray(value.history) && value.history.every(AChange.is)) || {
									property: "history",
									type: "Authorization.Change[]",
								},
							value.capture == undefined ||
								(Array.isArray(value.capture) && value.capture.every(Capture.is)) || {
									property: "capture",
									type: "Capture[]",
								},
							value.refund == undefined ||
								(Array.isArray(value.refund) && value.history.every(Refund.is)) || {
									property: "refund",
									type: "Refund[]",
								},
							value.void == undefined ||
								isoly.DateTime.is(value.void) || { property: "void", type: "isoly.DateTime | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function captured(captures: Capture[]): number {
		return captures.reduce<number>((total, capture) => total + capture.amount, 0)
	}
	export function refunded(refunds: Refund[]): number {
		return refunds.reduce<number>((total, refund) => total + refund.amount, 0)
	}
	export type Creatable = ACreatable
	export namespace Creatable {
		export const is = ACreatable.is
		export const flaw = ACreatable.flaw
	}
	export type Change = AChange
	export namespace Change {
		export const is = AChange.is
		export const flaw = AChange.flaw
		export type Creatable = AChange.Creatable
		export namespace Creatable {
			export const is = AChange.Creatable.is
			export const flaw = AChange.Creatable.flaw
		}
	}
}
