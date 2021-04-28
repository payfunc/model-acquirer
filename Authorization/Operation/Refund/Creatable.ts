import { Refund as AuthorizationRefund } from "../../../Refund"

export interface Creatable {
	type: "refund"
	refund: AuthorizationRefund.Creatable
}
export namespace Creatable {
	export function is(value: any | Creatable): value is Creatable {
		return typeof value == "object" && value.type == "refund" && AuthorizationRefund.Creatable.is(value.refund)
	}
}
