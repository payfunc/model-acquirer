import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Change as AChange } from "./Change"
import { Creatable as ACreatable } from "./Creatable"
import { Status as AuthorizationStatus } from "./Status"

export interface Authorization {
	id: authly.Identifier
	merchant: authly.Identifier
	number?: string
	reference: string
	created: isoly.DateTime
	amount: number
	currency: isoly.Currency
	card: model.Card
	descriptor?: string
	recurring?: "initial" | "subsequent"
	history: AChange[]
	capture: Capture[]
	refund: Refund[]
	void?: isoly.DateTime
	status: Partial<Record<AuthorizationStatus, number>>
}

export namespace Authorization {
	export function is(value: Authorization | any): value is Authorization {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id, 16) &&
			authly.Identifier.is(value.merchant) &&
			(value.number == undefined || typeof value.number == "string") &&
			typeof value.reference == "string" &&
			isoly.DateTime.is(value.created) &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			model.Card.is(value.card) &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			(value.recurring == undefined || ["initial", "subsequent"].includes(value.recurring)) &&
			Array.isArray(value.history) &&
			value.history.every(AChange.is) &&
			Array.isArray(value.capture) &&
			value.capture.every(Capture.is) &&
			Array.isArray(value.refund) &&
			value.refund.every(Refund.is) &&
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
							authly.Identifier.is(value.merchant) || { property: "merchant", type: "authly.Identifier" },
							value.number == undefined || typeof value.number == "string" || { property: "", type: "" },
							typeof value.reference == "string" || { property: "reference", type: "string" },
							isoly.DateTime.is(value.created) || { property: "created", type: "isoly.DateTime" },
							typeof value.amount == "number" || { property: "amount", type: "number" },
							isoly.Currency.is(value.currency) || { property: "currency", type: "isoly.Currency" },
							value.descriptor == undefined ||
								typeof value.descriptor == "string" || { property: "descriptor", type: "string | undefined" },
							value.recurring == undefined ||
								["initial", "subsequent"].includes(value.recurring) || {
									property: "recurring",
									type: `"initial" | "subsequent" | undefined`,
								},
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
	export function authorized(initial: number, history: AChange[]): number {
		return initial + history.reduce<number>((total, change) => total + change.amount, 0)
	}
	export function captured(captures: Capture[]): number {
		return captures.reduce<number>((total, capture) => total + capture.amount, 0)
	}
	export function refunded(refunds: Refund[]): number {
		return refunds.reduce<number>((total, refund) => total + refund.amount, 0)
	}
	export function calculateStatus(authorization: Omit<Authorization, "status">): Authorization {
		const capture = captured(authorization.capture)
		const refund = refunded(authorization.refund)
		const status: Record<AuthorizationStatus, number> = {
			authorized: isoly.Currency.round(
				authorized(authorization.amount, authorization.history) - capture,
				authorization.currency
			),
			captured: isoly.Currency.round(capture - refund, authorization.currency),
			refunded: isoly.Currency.round(refund, authorization.currency),
			settled: isoly.Currency.round(
				authorization.capture
					.concat(authorization.refund)
					.filter(p => p.settlement)
					.reduce<number>((r, p) => r + (p.settlement?.gross ?? 0), 0),
				authorization.currency
			),
		}
		for (const key of AuthorizationStatus.types)
			if (status[key] <= 0)
				delete status[key]
		return { ...authorization, status }
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
	export type Status = AuthorizationStatus
	export namespace Status {
		export const types = AuthorizationStatus.types
		export const is = AuthorizationStatus.is
	}
}
