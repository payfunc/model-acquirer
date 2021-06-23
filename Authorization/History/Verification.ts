import * as gracely from "gracely"
import * as isoly from "isoly"
import * as base from "@payfunc/model-base"
import { Error } from "../../Error"
import { Verification as AcquirerVerification } from "../../Verification"
import { Recurring } from "../Recurring"

export type Verification = Fail | Success | Pending
type Response = "method" | "challenge" | "authorization" | "postauthorization" | "preauthorization"
const types = ["method", "challenge", "authorization", "postauthorization", "preauthorization"]

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
	customer?: base.Contact // @deprecated
	contact?: base.Contact
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
			(value.customer == undefined || base.Contact.is(value.customer)) &&
			(value.contact == undefined || base.Contact.is(value.contact)) &&
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
			["preauthorization", "authorization"].includes(value.step) &&
			isBase(value)
		)
	}
	export function is(value: any | Verification): value is Verification {
		return isFail(value) || isSuccess(value) || isPending(value)
	}

	export function create(
		merchant: string,
		creatable: Omit<AcquirerVerification.Creatable, "card">,
		step: "preauthorization" | "authorization" | "postauthorization",
		response: Partial<Record<Response, any>>,
		input: gracely.Error | AcquirerVerification
	): Verification {
		return {
			merchant,
			number: creatable.number,
			date: isoly.DateTime.now(),
			type: "verification",
			items: creatable.items,
			currency: creatable.currency,
			target: creatable.target,
			browser: creatable.browser,
			contact: creatable.contact,
			recurring: creatable.recurring,
			response,
			...(!gracely.Error.is(input)
				? { status: "success", step: step as "authorization" | "postauthorization" }
				: input.error == "verification required"
				? { status: "pending", step: step as "authorization" | "preauthorization" }
				: { status: "fail", step, reason: Error.Code.is(input.error) ? input.error : "unknown error", error: input }),
		}
	}
}
