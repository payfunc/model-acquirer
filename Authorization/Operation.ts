import * as authly from "authly"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Change } from "./Change"

export interface Operation {
	id: authly.Identifier
	change?: Change.Creatable
	capture?: Capture.Creatable
	refund?: Refund.Creatable
	void?: true
}
export namespace Operation {
	export function is(value: any | Operation): value is Operation {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id) &&
			(value.change == undefined || Change.Creatable.is(value.change)) &&
			(value.capture == undefined || Capture.Creatable.is(value.capture)) &&
			(value.refund == undefined || Refund.Creatable.is(value.refund)) &&
			(value.void == undefined || value.void == true)
		)
	}
}
