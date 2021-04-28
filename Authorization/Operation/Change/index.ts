import * as gracely from "gracely"
import { Change as AuthorizationChange } from "../../Change"
import { Creatable as ChangeCreatable } from "./Creatable"

export interface Change {
	number?: string
	type: "change"
	change: AuthorizationChange | gracely.Error
}
export namespace Change {
	export function is(value: any | Change): value is Change {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			value.type == "change" &&
			(AuthorizationChange.is(value.change) || gracely.Error.is(value.change))
		)
	}
	export type Creatable = ChangeCreatable
	export namespace Creatable {
		export const is = ChangeCreatable.is
	}
}
