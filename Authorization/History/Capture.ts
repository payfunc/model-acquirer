import * as gracely from "gracely"
import * as isoly from "isoly"
import { Capture as AuthorizationCapture } from "../../Capture"
import { Error } from "../../Error"

export type Capture = Fail | Success

interface Base {
	merchant: string
	number: string
	date: isoly.DateTime
	type: "capture"
	amount: number
	status: "success" | "fail"
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
export namespace Capture {
	function isBase(value: any | Base): value is Base {
		return (
			typeof value == "object" &&
			typeof value.merchant == "string" &&
			typeof value.number == "string" &&
			isoly.DateTime.is(value.date) &&
			value.type == "capture" &&
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
		return typeof value == "object" && value.status == "success" && typeof value.reference == "string" && isBase(value)
	}
	export function is(value: any | Capture): value is Capture {
		return isFail(value) || isSuccess(value)
	}
	export function create(
		merchant: string,
		authorization: { number: string; currency: isoly.Currency },
		amount: number,
		input: gracely.Error | AuthorizationCapture
	): Capture {
		return {
			merchant,
			type: "capture",
			date: isoly.DateTime.now(),
			number: authorization.number,
			currency: authorization.currency,
			amount,
			...(gracely.Error.is(input)
				? { status: "fail", reason: Error.Code.is(input.error) ? input.error : "unknown error", error: input }
				: { status: "success", reference: input.reference ?? "unknown reference" }),
		}
	}
}
