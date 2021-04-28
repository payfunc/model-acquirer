import * as gracely from "gracely"
import { Capture as AuthorizationCapture } from "../../../Capture"
import { Creatable as CaptureCreatable } from "./Creatable"

export interface Capture {
	number?: string
	type: "capture"
	capture: AuthorizationCapture | gracely.Error
}
export namespace Capture {
	export function is(value: any | Capture): value is Capture {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			value.type == "capture" &&
			(AuthorizationCapture.is(value.capture) || gracely.Error.is(value.capture))
		)
	}
	export type Creatable = CaptureCreatable
	export namespace Creatable {
		export const is = CaptureCreatable.is
	}
}
