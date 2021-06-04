import * as gracely from "gracely"
import * as isoly from "isoly"
import { Error } from "../../Error"

export type Refund = Fail | Success

interface Base {
	merchant: string
	number: string
	date: isoly.DateTime
	type: "refund"
	amount: number
	currency: isoly.Currency
}

interface Fail extends Base {
	status: "fail"
	reason: Error.Code
	error: gracely.Error
}

interface Success extends Base {
	status: "success"
	reference: string
}

export namespace Refund {
	export function isBase(value: any | Base): value is Base {
		return (
			typeof value == "object" &&
			typeof value.merchant == "string" &&
			typeof value.number == "string" &&
			isoly.DateTime.is(value.date) &&
			value.type == "refund" &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency)
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
		return typeof value == "object" && value.status == "success" && typeof value.status == "string" && isBase(value)
	}
	export function is(value: any | Refund): value is Refund {
		return isFail(value) || isSuccess(value)
	}
}
