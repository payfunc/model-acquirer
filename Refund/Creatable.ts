import * as gracely from "gracely"
export interface Creatable {
	number?: string
	amount?: number
	descriptor?: string
}

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			(value.amount == undefined || typeof value.amount == "number") &&
			(value.descriptor == undefined || typeof value.descriptor == "string")
		)
	}
	export function flaw(value: Creatable | any): gracely.Flaw {
		return {
			type: "Refund.Creatable",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							value.number == undefined ||
								typeof value.number == "string" || { property: "number", type: "string | undefined" },
							value.amount == undefined ||
								typeof value.amount == "number" || { property: "amount", type: "number | undefined" },
							value.descriptor == undefined ||
								typeof value.descriptor == "string" || { property: "descriptor", type: "string | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
