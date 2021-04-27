import * as authly from "authly"
import { Capture } from "../../Capture"
import { Refund } from "../../Refund"
import { Change } from "../Change"

export type Creatable = {
	id: authly.Identifier
} & (
	| { type: "change"; change: Change.Creatable }
	| { type: "capture"; capture: Capture.Creatable }
	| { type: "refund"; refund: Refund.Creatable }
	| { type: "void" }
)
export namespace Creatable {
	export function is(value: any | Creatable): value is Creatable {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id) &&
			(value.change == undefined || (value.type == "change" && Change.Creatable.is(value.change))) &&
			(value.capture == undefined || (value.type == "capture" && Capture.Creatable.is(value.capture))) &&
			(value.refund == undefined || (value.type == "refund" && Refund.Creatable.is(value.refund))) &&
			(value.void == undefined || value.type == "void")
		)
	}
}
