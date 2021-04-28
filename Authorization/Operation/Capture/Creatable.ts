import { Capture as AuthorizationCapture } from "../../../Capture"

export interface Creatable {
	type: "capture"
	capture: AuthorizationCapture.Creatable
}
export namespace Creatable {
	export function is(value: any | Creatable): value is Creatable {
		return typeof value == "object" && value.type == "capture" && AuthorizationCapture.Creatable.is(value.capture)
	}
}
