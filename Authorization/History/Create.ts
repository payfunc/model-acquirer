import * as gracely from "gracely"
import * as isoly from "isoly"
import { Card } from "@payfunc/model-card"
import { Error } from "../../Error"
import { Recurring } from "../Recurring"

export type Create = Fail | Success | Pending

interface Base {
	merchant: string
	number: string
	date: isoly.DateTime
	type: "create"
	status: "fail" | "success" | "pending"
}

interface Fail extends Base {
	status: "fail"
	amount?: number
	currency?: isoly.Currency
	card?: Card
	descriptor?: string
	recurring?: Recurring
	verification?: "verified" | "rejected" | "unavailable"
	rule?: string[]
	reason: Error.Code
	error: gracely.Error
}
interface Success extends Base {
	verification?: "verified" | "rejected" | "unavailable"
	status: "success"
}
interface Pending extends Base {
	status: "pending"
	rule: string
	reason: "verification required"
	amount?: number
	currency?: isoly.Currency
	card?: Card
	descriptor?: string
	recurring?: Recurring
}
export namespace Create {
	function isBase(value: any | Base): value is Base {
		return (
			typeof value == "object" &&
			typeof value.merchant == "string" &&
			typeof value.number == "string" &&
			value.type == "create" &&
			isoly.DateTime.is(value.date)
		)
	}
	export function isFail(value: any | Fail): value is Fail {
		return (
			typeof value == "object" &&
			(value.amount == undefined || typeof value.amount == "number") &&
			(value.currency == undefined || isoly.Currency.is(value.currency)) &&
			(value.card == undefined || Card.is(value.card)) &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			(value.verification == undefined || ["verified", "rejected", "unavailable"].includes(value.verification)) &&
			value.status == "fail" &&
			(value.rule == undefined || (Array.isArray(value.rule) && value.rule.every((r: any) => typeof r == "string"))) &&
			Error.Code.is(value.reason) &&
			gracely.Error.is(value.error) &&
			(value.recurring == undefined || Recurring.is(value.recurring)) &&
			isBase(value)
		)
	}

	export function isSuccess(value: any | Success): value is Success {
		return (
			typeof value == "object" &&
			(value.verification == undefined || ["verified", "rejected", "unavailable"].includes(value.verification)) &&
			value.status == "success" &&
			isBase(value)
		)
	}

	export function isPending(value: any | Pending): value is Pending {
		return (
			typeof value == "object" &&
			value.status == "pending" &&
			typeof value.rule == "string" &&
			value.reason == "verification required" &&
			(value.recurring == undefined || Recurring.is(value.recurring)) &&
			(value.amount == undefined || typeof value.amount == "number") &&
			(value.currency == undefined || isoly.Currency.is(value.currency)) &&
			(value.card == undefined || Card.is(value.card)) &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			isBase(value)
		)
	}

	export function is(value: any | Create): value is Create {
		return isFail(value) || isSuccess(value) || isPending(value)
	}
}
