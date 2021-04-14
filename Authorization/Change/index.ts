import * as gracely from "gracely"
import * as isoly from "isoly"
import { Creatable as ChangeCreatable } from "./Creatable"

export interface Change {
	number?: string
	created: isoly.DateTime
	amount: number
}

export namespace Change {
	export function is(value: Change | any): value is Change {
		return (
			typeof value == "object" &&
			(value.number == undefined || typeof value.number == "string") &&
			isoly.DateTime.is(value.created) &&
			typeof value.amount == "number"
		)
	}
	export function flaw(value: Change | any): gracely.Flaw {
		return {
			type: "Authorization.Change",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							value.number == undefined ||
								typeof value.number == "string" || { property: "number", type: "string | undefined" },
							isoly.DateTime.is(value.created) || { property: "created", type: "isoly.DateTime" },
							typeof value.amount == "number" || { property: "amount", type: "number" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function toCsv(history: Change[]): string {
		let result = history.length > 0 ? "number,created,amount\r\n" : ""
		for (const value of history)
			result += `${value.number ?? ""},${value.created},${value.amount}\r\n`
		return result
	}
	export type Creatable = ChangeCreatable
	export namespace Creatable {
		export const is = ChangeCreatable.is
		export const flaw = ChangeCreatable.flaw
	}
}
