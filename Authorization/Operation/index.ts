import * as authly from "authly"
import { Capture as OperationCapture } from "./Capture"
import { Change as OperationChange } from "./Change"
import { Creatable as OperationCreatable } from "./Creatable"
import { Refund as OperationRefund } from "./Refund"
import { Void as OperationVoid } from "./Void"

export type Operation = Record<authly.Identifier, OperationChange | OperationCapture | OperationRefund | OperationVoid>

export namespace Operation {
	export function is(value: any | Creatable): value is Creatable {
		return (
			typeof value == "object" &&
			Object.entries(value).every(
				v =>
					authly.Identifier.is(v[0], 16) &&
					(OperationChange.is(v[1]) || OperationCapture.is(v[1]) || OperationRefund.is(v[1]) || OperationVoid.is(v[1]))
			)
		)
	}
	export type Creatable = OperationCreatable
	export namespace Creatable {
		export const is = OperationCreatable.is
	}
	export type Capture = OperationCapture
	export namespace Capture {
		export const is = OperationCapture.is
		export type Creatable = OperationCapture.Creatable
		export namespace Creatable {
			export const is = OperationCapture.Creatable.is
		}
	}
	export type Change = OperationChange
	export namespace Change {
		export const is = OperationChange.is
		export type Creatable = OperationChange.Creatable
		export namespace Creatable {
			export const is = OperationChange.Creatable.is
		}
	}
	export type Refund = OperationRefund
	export namespace Refund {
		export const is = OperationRefund.is
		export type Creatable = OperationRefund.Creatable
		export namespace Creatable {
			export const is = OperationRefund.Creatable.is
		}
	}
	export type Void = OperationVoid
	export namespace Void {
		export const is = OperationVoid.is
		export type Creatable = OperationVoid.Creatable
		export namespace Creatable {
			export const is = OperationVoid.Creatable.is
		}
	}
}
