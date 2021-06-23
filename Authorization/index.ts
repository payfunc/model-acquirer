import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Change as AChange } from "./Change"
import { Creatable as ACreatable } from "./Creatable"
import { History as AHistory } from "./History"
import { Operation as AuthorizationOperation } from "./Operation"
import { Recurring as AuthorizationRecurring } from "./Recurring"
import { Status as AuthorizationStatus } from "./Status"
export interface Authorization {
	id: authly.Identifier
	merchant: authly.Identifier
	number: string
	reference: string
	created: isoly.DateTime
	amount: number
	currency: isoly.Currency
	card: model.Card
	descriptor?: string
	recurring?: AuthorizationRecurring
	history: AHistory[]
	change?: AChange[]
	capture: Capture[]
	refund: Refund[]
	void?: isoly.DateTime
	status: Partial<Record<AuthorizationStatus, number>>
	category?: "purchase" | "withdrawal"
}

export namespace Authorization {
	export function is(value: Authorization | any): value is Authorization {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id, 16) &&
			authly.Identifier.is(value.merchant) &&
			typeof value.number == "string" &&
			typeof value.reference == "string" &&
			isoly.DateTime.is(value.created) &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			model.Card.is(value.card) &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			(value.recurring == undefined || AuthorizationRecurring.is(value.recurring)) &&
			Array.isArray(value.history) &&
			value.history.every(AHistory.is) &&
			(value.change == undefined || (Array.isArray(value.change) && value.change.every(AChange.is))) &&
			Array.isArray(value.capture) &&
			value.capture.every(Capture.is) &&
			Array.isArray(value.refund) &&
			value.refund.every(Refund.is) &&
			(value.void == undefined || isoly.DateTime.is(value.void)) &&
			(value.category == undefined || value.category == "purchase" || value.category == "withdrawal")
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
							(Array.isArray(value.history) && value.history.every(AHistory.is)) || {
								property: "history",
								type: "Authorization.History[]",
							},
							value.change == undefined ||
								(Array.isArray(value.change) && value.change.every(AChange.is)) || {
									property: "change",
									type: "Authorization.Change[]",
								},
							(Array.isArray(value.capture) && value.capture.every(Capture.is)) || {
								property: "capture",
								type: "Capture[]",
							},
							(Array.isArray(value.refund) && value.refund.every(Refund.is)) || {
								property: "refund",
								type: "Refund[]",
							},
							value.void == undefined ||
								isoly.DateTime.is(value.void) || { property: "void", type: "isoly.DateTime | undefined" },
							value.category == undefined ||
								value.category == "purchase" ||
								value.category == "withdrawal" || {
									property: "category",
									type: `"purchase" | "withdrawal" | undefined`,
								},
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function authorized(authorization: Omit<Authorization, "status">): number {
		return isoly.Currency.round(
			authorization.amount + (authorization.change?.reduce<number>((total, change) => total + change.amount, 0) ?? 0),
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
		let result = ""
		result += "id,"
		result += "merchant,"
		result += "number,"
		result += "reference,"
		result += "created,"
		result += "category,"
		result += "amount,"
		result += "currency,"
		result += "card type,"
		result += "card scheme,"
		result += "card,"
		result += "card expires,"
		result += "descriptor,"
		result += "recurring,"
		result += "change,"
		result += "capture,"
		result += "refund,"
		result += "void,"
		result += "status"
		result += "\r\n"
		for (const value of authorizations) {
			result += `"${value.id}",`
			result += `"${value.merchant}",`
			result += `"${value.number ?? ""}",`
			result += `"${value.reference}",`
			result += `"${value.created}",`
			result += `"${value.category ?? ""}",`
			result += `"${value.amount}",`
			result += `"${value.currency}",`
			result += `"${value.card.type ?? "unknown"}",`
			result += `"${value.card.scheme}",`
			result += `"${value.card.iin + "**********" + value.card.last4}",`
			result += `"${value.card.expires[0].toString().padStart(2, "0")}/${(2000 + value.card.expires[1]).toString()}",`
			result += `"${value.descriptor ?? ""}",`
			result += `"${value.recurring ?? ""}",`
			result += `"${isoly.Currency.round(value.change?.reduce((r, h) => r + h.amount, 0) ?? 0, value.currency)}",`
			result += `"${captured(value)}",`
			result += `"${refunded(value)}",`
			result += `"${value.void ?? ""}",`
			result += `"${Object.keys(value.status).join(" ")}"`
			result += "\r\n"
		}
		return result
	}
	export type Creatable = ACreatable
	export const Creatable = ACreatable
	export type History = AHistory
	export const History = AHistory
	export type Change = AChange
	export namespace Change {
		export const is = AChange.is
		export const flaw = AChange.flaw
		export type Creatable = AChange.Creatable
		export const Creatable = AChange.Creatable
	}
	export type Operation = AuthorizationOperation
	export namespace Operation {
		export const is = AuthorizationOperation.is
		export type Creatable = AuthorizationOperation.Creatable
		export const Creatable = AuthorizationOperation.Creatable
	}
	export type Status = AuthorizationStatus
	export const Status = AuthorizationStatus
	export type Recurring = AuthorizationRecurring
	export namespace Recurring {
		export const is = AuthorizationRecurring.is
		export const template = AuthorizationRecurring.template
	}
}
