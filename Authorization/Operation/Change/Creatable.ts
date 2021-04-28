import { Change as AuthorizationChange } from "../../Change"

export interface Creatable {
	type: "change"
	change: AuthorizationChange.Creatable
}
export namespace Creatable {
	export function is(value: any | Creatable): value is Creatable {
		return typeof value == "object" && value.type == "change" && AuthorizationChange.Creatable.is(value.change)
	}
}
