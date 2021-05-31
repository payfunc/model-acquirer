import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Change as AChange } from "./Change"
import { Creatable as ACreatable } from "./Creatable"
import { Operation as AuthorizationOperation } from "./Operation"
import { Recurring as AuthorizationRecurring } from "./Recurring"
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
	recurring?: AuthorizationRecurring
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
			(value.recurring == undefined || AuthorizationRecurring.is(value.recurring)) &&
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
	export function authorized(authorization: Omit<Authorization, "status">): number {
		return isoly.Currency.round(
			authorization.amount + authorization.history.reduce<number>((total, change) => total + change.amount, 0),
			authorization.currency
		)
	}
	export function captured(authorization: Omit<Authorization, "status">): number {
		return isoly.Currency.round(
			authorization.capture.reduce<number>(
				(total, capture) => total + (capture.status != "pending" ? capture.amount : 0),
				0
			),
			authorization.currency
		)
	}
	export function refunded(authorization: Omit<Authorization, "status">): number {
		return isoly.Currency.round(
			authorization.refund.reduce<number>(
				(total, refund) => total + (refund.status != "pending" ? refund.amount : 0),
				0
			),
			authorization.currency
		)
	}
	export function calculateStatus(
		authorization: Omit<Authorization, "status"> & { status?: Partial<Record<AuthorizationStatus, number>> }
	): Authorization {
		const capture = captured(authorization)
		const refund = refunded(authorization)
		const captureSettled = authorization.capture
			.filter(p => p.settlement)
			.reduce<number>((r, p) => r + Math.abs(p.settlement?.gross ?? 0), 0)
		const refundSettled = authorization.refund
			.filter(p => p.settlement)
			.reduce<number>((r, p) => r + Math.abs(p.settlement?.gross ?? 0), 0)
		const captureStatusSum = Math.max(capture - refund, 0) - Math.max(captureSettled - refundSettled, 0)
		const authorize = isoly.Currency.round(authorized(authorization) - capture, authorization.currency)
		const status: Record<AuthorizationStatus, number> = {
			authorized: !authorization.void ? authorize : 0,
			captured: isoly.Currency.round(Math.max(captureStatusSum, 0), authorization.currency),
			refunded: isoly.Currency.round(refund - refundSettled, authorization.currency),
			settled: isoly.Currency.round(
				Math.max(captureSettled, refundSettled) + Math.min(captureStatusSum, 0),
				authorization.currency
			),
			cancelled: authorization.void ? authorize : 0,
		}
		for (const key of AuthorizationStatus.types)
			if (status[key] <= 0)
				delete status[key]
		if (Object.entries(status).length < 1)
			status[authorization.void ? "cancelled" : "authorized"] = 0
		return { ...authorization, status }
	}
	export function toCsv(authorizations: Authorization[]): string {
		let result =
			"id,merchant,number,reference,created,amount,currency,card type,card scheme,card,card expires,descriptor,recurring,history,capture,refund,void,status\r\n"
		for (const value of authorizations)
			result += `${value.id},${value.merchant},${value.number ?? ""},${value.reference},${value.created},${
				value.amount
			},${value.currency},${value.card.type ?? "unknown"},${value.card.scheme},${
				value.card.iin + "**********" + value.card.last4
			},${value.card.expires[0].toString().padStart(2, "0") + "/" + (2000 + value.card.expires[1]).toString()},${
				value.descriptor ?? ""
			},${value.recurring ?? ""},${isoly.Currency.round(
				value.history.reduce((r, h) => r + h.amount, 0),
				value.currency
			)},${captured(value)},${refunded(value)},${value.void ?? ""},${Object.keys(value.status).join(" ")}\r\n`
		return result
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
	export type Operation = AuthorizationOperation
	export namespace Operation {
		export const is = AuthorizationOperation.is
		export type Creatable = AuthorizationOperation.Creatable
		export namespace Creatable {
			export const is = AuthorizationOperation.Creatable.is
		}
	}
	export type Status = AuthorizationStatus
	export namespace Status {
		export const types = AuthorizationStatus.types
		export const is = AuthorizationStatus.is
	}

	export type Recurring = AuthorizationRecurring
	export namespace Recurring {
		export const is = AuthorizationRecurring.is
		export const template = AuthorizationRecurring.template
	}
}
