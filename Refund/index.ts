import * as gracely from "gracely"
import * as isoly from "isoly"
import { Settlement } from "../Settlement"
import { Creatable as RCreatable } from "./Creatable"

export class Refund {
	number?: string
	created: isoly.DateTime
	reference?: string
	approved?: isoly.DateTime
	amount: number
	descriptor?: string
	settlement?: Settlement.Transaction
	status: "approved" | "pending" | "settled"
}

export namespace Refund {
	export function is(value: Refund | any): value is Refund {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			isoly.DateTime.is(value.created) &&
			(value.reference == undefined || typeof value.reference == "string") &&
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
							value.reference == undefined ||
								typeof value.reference == "string" || { property: "reference", type: "string | undefined" },
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
	export function toCsv(refunds: Refund[]): string {
		let result = refunds.length > 0 ? "number,created,reference,approved,amount,settlement,descriptor,status\r\n" : ""
		for (const value of refunds)
			result += `${value.number ?? ""},${value.created},${value.reference ?? ""},${value.approved ?? "false"},${
				value.amount
			},${value.settlement?.reference ?? "not settled"},${value.descriptor ?? ""},${value.status}\r\n`
		return result
	}
	export type Creatable = RCreatable
	export namespace Creatable {
		export const is = RCreatable.is
		export const flaw = RCreatable.flaw
	}
}
