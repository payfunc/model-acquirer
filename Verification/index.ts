import { Creatable as VCreatable } from "./Creatable"
import { Pares as VPares } from "./Pares/index"

export type Verification =
	| {
			type: "pares"
			data: VPares
	  }
	| {
			type: "method" | "challenge"
			data: {
				authentication: string
				status: "A" | "N" | "U" | "Y" | "C" | "R"
				reference: {
					server: string // threeDSServerTransID
					directory: string //dsTransID
				}
			}
	  }

export namespace Verification {
	export function is(value: any | Verification): value is Verification {
		return (
			typeof value == "object" &&
			((value.type == "pares" && VPares.is(value.data)) ||
				(["method", "challenge"].includes(value.type) &&
					typeof value.data == "object" &&
					typeof value.data.authentication == "string" &&
					["A", "N", "U", "Y", "C", "R"].includes(value.data.status) &&
					typeof value.data.reference == "object" &&
					typeof value.data.reference.server == "string" &&
					typeof value.data.reference.directory == "string"))
		)
	}

	export type Creatable = VCreatable
	export namespace Creatable {
		export const is = VCreatable.is
	}
	export type Pares = VPares
	export namespace Pares {
		export const is = VPares.is
		export const check = VPares.check
		export const fromEci = VPares.fromEci
	}
}
