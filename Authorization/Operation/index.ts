import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import { Capture } from "../../Capture"
import { Refund } from "../../Refund"
import { Change } from "../Change"
import { Creatable as OperationCreatable } from "./Creatable"

export type Operation = {
	id: authly.Identifier
} & (
	| { type: "change"; change: Change | gracely.Error }
	| { type: "capture"; capture: Capture | gracely.Error }
	| { type: "refund"; refund: Refund | gracely.Error }
	| { type: "void"; void: isoly.DateTime | gracely.Error }
)
export namespace Operation {
	export function is(value: any | Operation): value is Operation {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id) &&
			(value.change == undefined || (value.type == "change" && Change.is(value.change))) &&
			(value.capture == undefined || (value.type == "capture" && Capture.is(value.capture))) &&
			(value.refund == undefined || (value.type == "refund" && Refund.is(value.refund))) &&
			(value.void == undefined || (value.type == "void" && isoly.DateTime.is(value.void)))
		)
	}
	export type Creatable = OperationCreatable
	export namespace Creatable {
		export const is = OperationCreatable.is
	}
}
