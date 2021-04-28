import * as gracely from "gracely"
import { Refund as AuthorizationRefund } from "../../../Refund"
import { Creatable as RefundCreatable } from "./Creatable"

export interface Refund {
	number?: string
	type: "refund"
	refund: AuthorizationRefund | gracely.Error
}
export namespace Refund {
	export function is(value: any | Refund): value is Refund {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			value.type == "refund" &&
			(AuthorizationRefund.is(value.refund) || gracely.Error.is(value.refund))
		)
	}
	export type Creatable = RefundCreatable
	export namespace Creatable {
		export const is = RefundCreatable.is
	}
}
