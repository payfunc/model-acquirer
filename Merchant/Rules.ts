import * as gracely from "gracely"
export interface Rules {
	general: string[]
	authorization: string[]
	capture: string[]
	void: string[]
	refund: string[]
}

export namespace Rules {
	export function is(value: any | Rules): value is Rules {
		return (
			typeof value == "object" &&
			Array.isArray(value.general) &&
			value.general.every((v: any) => typeof v == "string") &&
			Array.isArray(value.authorization) &&
			value.authorization.every((v: any) => typeof v == "string") &&
			Array.isArray(value.capture) &&
			value.capture.every((v: any) => typeof v == "string") &&
			Array.isArray(value.void) &&
			value.void.every((v: any) => typeof v == "string") &&
			Array.isArray(value.refund) &&
			value.refund.every((v: any) => typeof v == "string")
		)
	}
	export function flaw(value: any | Rules): gracely.Flaw {
		return {
			type: "Merchant.Rules",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							(Array.isArray(value.general) && value.general.every((v: any) => typeof v == "string")) || {
								property: "general",
								type: "string[]",
							},
							(Array.isArray(value.authorization) && value.authorization.every((v: any) => typeof v == "string")) || {
								property: "authorization",
								type: "string[]",
							},
							(Array.isArray(value.capture) && value.capture.every((v: any) => typeof v == "string")) || {
								property: "capture",
								type: "string[]",
							},
							(Array.isArray(value.void) && value.void.every((v: any) => typeof v == "string")) || {
								property: "void",
								type: "string[]",
							},
							(Array.isArray(value.refund) && value.refund.every((v: any) => typeof v == "string")) || {
								property: "refund",
								type: "string[]",
							},
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
