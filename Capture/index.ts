import * as gracely from "gracely"
import * as isoly from "isoly"
import { Creatable as CCreatable } from "./Creatable"

export class Capture {
	number?: string
	created: isoly.DateTime
	approved?: isoly.DateTime
	amount: number
	descriptor?: string
	status: "approved" | "pending"
}

export namespace Capture {
	export function is(value: Capture | any): value is Capture {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			isoly.DateTime.is(value.created) &&
			(value.approved == undefined || isoly.DateTime.is(value.approved)) &&
			typeof value.amount == "number" &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			["approved", "pending"].some(v => v == value.status)
		)
	}
	export function flaw(value: Capture | any): gracely.Flaw {
		return {
			type: "Capture",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							value.number == undefined ||
								typeof value.number == "string" || { property: "number", type: "string | undefined" },
							isoly.DateTime.is(value.created) || { property: "created", type: "isoly.DateTime" },
							value.approved == undefined ||
								isoly.DateTime.is(value.approved) || { property: "approved", type: "isoly.DateTime | undefined" },
							typeof value.amount == "number" || { property: "amount", type: "number" },
							value.descriptor == undefined ||
								typeof value.descriptor == "string" || { property: "descriptor", type: "string | undefined" },
							["approved", "pending"].some(v => v == value.status) || {
								property: "status",
								type: '"approved" | "pending"',
							},
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}

	export type Creatable = CCreatable
	export namespace Creatable {
		export const is = CCreatable.is
		export const flaw = CCreatable.flaw
	}
}
