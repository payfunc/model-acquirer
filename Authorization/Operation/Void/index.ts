import * as gracely from "gracely"
import * as isoly from "isoly"
import { Creatable as VoidCreatable } from "./Creatable"

export interface Void {
	number?: string
	type: "void"
	void: isoly.DateTime | gracely.Error
}
export namespace Void {
	export function is(value: any | Void): value is Void {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			value.type == "void" &&
			(isoly.DateTime.is(value.void) || gracely.Error.is(value.void))
		)
	}
	export type Creatable = VoidCreatable
	export namespace Creatable {
		export const is = VoidCreatable.is
	}
}
