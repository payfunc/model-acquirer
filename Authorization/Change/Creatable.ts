import * as gracely from "gracely"
export interface Creatable {
	// TODO: find a better name
	number?: string
	amount?: number
}
export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			(value.amount == undefined || typeof value.amount == "number")
		)
	}
	export function flaw(value: Creatable | any): gracely.Flaw {
		return {
			type: "Authorization.Change.Creatable",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							value.number == undefined ||
								typeof value.number == "string" || { property: "number", type: "string | undefined" },
							value.amount == undefined ||
								typeof value.amount == "number" || { property: "amount", type: "number | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
