import { Capture as HCapture } from "./Capture"
import { Create as HCreate } from "./Create"
import { Refund as HRefund } from "./Refund"
import { Settlement as HSettlement } from "./Settlement"
import { Verification as HVerification } from "./Verification"
import { Void as HVoid } from "./Void"

export type History = HCapture | HCreate | HRefund | HSettlement | HVerification | HVoid

export namespace History {
	export function is(value: any | History): value is History {
		return (
			HCapture.is(value) ||
			HCreate.is(value) ||
			HRefund.is(value) ||
			HSettlement.is(value) ||
			HVerification.is(value) ||
			HVoid.is(value)
		)
	}
	export type Capture = HCapture
	export const capture = HCapture.create
	export namespace Capture {
		export const is = HCapture.is
	}
	export type Create = HCreate
	export const authorize = HCreate.create
	export namespace Create {
		export const is = HCreate.is
	}
	export type Refund = HRefund
	export const refund = HRefund.create
	export namespace Refund {
		export const is = HRefund.is
	}
	export type Settlement = HSettlement
	export namespace Settlement {
		export const is = HSettlement.is
	}
	export type Verification = HVerification
	export const verify = HVerification.create
	export namespace Verification {
		export const is = HVerification.is
	}
	export type Void = HVoid
	export const cancel = HVoid.create
	export namespace Void {
		export const is = HVoid.is
	}
}
