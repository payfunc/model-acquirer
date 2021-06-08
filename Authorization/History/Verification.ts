import * as gracely from "gracely"
import * as isoly from "isoly"
import * as base from "@payfunc/model-base"
import { Error } from "../../Error"
import { Recurring } from "../Recurring"

export type Verification = Fail | Success | Pending
type Response = "pares" | "method" | "challenge" | "authorization" | "postauthorization" | "preauthorization"
const types = ["pares", "method", "challenge", "authorization", "postauthorization", "preauthorization"]

interface Base {
	merchant: string
	number: string
	date: isoly.DateTime
	type: "verification"
	status: "fail" | "success" | "pending"
	step: "preauthorization" | "authorization" | "postauthorization"
	response: Partial<Record<Response, any>>
	items: number | base.Item | base.Item[]
	currency: isoly.Currency
	target: string
	browser?: base.Browser
	customer?: base.Customer
	recurring?: Recurring
}

interface Fail extends Base {
	status: "fail"
	reason: Error.Code
	error: gracely.Error
}

interface Success extends Base {
	status: "success"
	step: "postauthorization" | "authorization"
}

interface Pending extends Base {
	status: "pending"
	step: "preauthorization" | "authorization"
}

export namespace Verification {
	function isBase(value: any | Base): value is Base {
		return (
			typeof value == "object" &&
			typeof value.merchant == "string" &&
			typeof value.number == "string" &&
			isoly.DateTime.is(value.date) &&
			value.type == "verification" &&
			["fail", "success", "pending"].includes(value.status) &&
			["preauthorization", "authorization", "postauthorization"].includes(value.step) &&
			typeof value.response == "object" &&
			Object.keys(value.response).every(k => types.includes(k)) &&
			(typeof value.items == "number" ||
				base.Item.is(value.items) ||
				(Array.isArray(value.items) && value.items.every(base.Item.is))) &&
			isoly.Currency.is(value.currency) &&
			typeof value.target == "string" &&
			(value.browser == undefined || base.Browser.is(value.browser)) &&
			(value.customer == undefined || base.Customer.is(value.customer)) &&
			(value.recurring == undefined || Recurring.is(value.recurring))
		)
	}
	export function isFail(value: any | Fail): value is Fail {
		return (
			typeof value == "object" &&
			value.status == "fail" &&
			Error.Code.is(value.reason) &&
			gracely.Error.is(value.error) &&
			isBase(value)
		)
	}
	export function isSuccess(value: any | Success): value is Success {
		return (
			typeof value == "object" &&
			value.status == "success" &&
			["postauthorization", "authorization"].includes(value.step) &&
			isBase(value)
		)
	}
	export function isPending(value: any | Pending): value is Pending {
		return (
			typeof value == "object" &&
			value.status == "pending" &&
			["postauthorization", "authorization"].includes(value.step) &&
			isBase(value)
		)
	}
	export function is(value: any | Verification): value is Verification {
		return isFail(value) || isSuccess(value) || isPending(value)
	}
}