import * as gracely from "gracely"
import * as isoly from "isoly"
import { Creatable as RCreatable } from "./Creatable"

export class Refund {
	number?: string
	created: isoly.DateTime
	approved?: isoly.DateTime
	amount: number
	descriptor?: string
	status: "approved" | "pending"
}

export namespace Refund {
	export function is(value: Refund | any): value is Refund {
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
	export function flaw(value: Refund | any): gracely.Flaw {
		return {
			type: "Refund",
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

	export type Creatable = RCreatable
	export namespace Creatable {
		export const is = RCreatable.is
		export const flaw = RCreatable.flaw
	}
}
