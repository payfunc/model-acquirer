import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import { Capture } from "../../Capture"
import { Refund } from "../../Refund"
import { Change } from "../Change"
import { Creatable as OperationCreatable } from "./Creatable"

export interface Operation {
	id: authly.Identifier
	change?: Change | gracely.Error
	capture?: Capture | gracely.Error
	refund?: Refund | gracely.Error
	void?: isoly.DateTime | gracely.Error
}
export namespace Operation {
	export function is(value: any | Operation): value is Operation {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id) &&
			(value.change == undefined || Change.is(value.change) || gracely.Error.is(value.change)) &&
			(value.capture == undefined || Capture.is(value.capture) || gracely.Error.is(value.capture)) &&
			(value.refund == undefined || Refund.is(value.refund) || gracely.Error.is(value.refund)) &&
			(value.void == undefined || isoly.DateTime.is(value.void) || gracely.Error.is(value.void))
		)
	}
	export type Creatable = OperationCreatable
	export namespace Creatable {
		export const is = OperationCreatable.is
	}
}
