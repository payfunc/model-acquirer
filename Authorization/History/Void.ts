import * as gracely from "gracely"
import * as isoly from "isoly"
import { Error } from "../../Error"

export type Void = Fail | Success

interface Base {
	merchant: string
	number: string
	date: isoly.DateTime
	type: "void"
	status: "fail" | "success"
}

interface Fail extends Base {
	status: "fail"
	reason: Error.Code
	error: gracely.Error
}

interface Success extends Base {
	status: "success"
}
export namespace Void {
	function isBase(value: any | Base): value is Base {
		return (
			typeof value == "object" &&
			typeof value.merchant == "string" &&
			typeof value.number == "string" &&
			isoly.DateTime.is(value.date) &&
			value.type == "void" &&
			["fail", "success"].includes(value.status)
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
		return typeof value == "object" && value.status == "success" && isBase(value)
	}
	export function is(value: any | Void): value is Void {
		return isFail(value) || isSuccess(value)
	}
}
