import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"

export interface Creatable {
	number: string
	amount: number
	currency: isoly.Currency
	card: authly.Token | model.Card.Creatable
	descriptor?: string
	capture?: "auto"
	recurring?: "initial" | "subsequent"
}
export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return (
			typeof value == "object" &&
			typeof value.number == "string" &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			(authly.Token.is(value.card) || model.Card.Creatable.is(value.card)) &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			(value.capture == undefined || ["auto"].some(v => v == value.capture)) &&
			(value.recurring == undefined || ["initial", "subsequent"].includes(value.recurring))
		)
	}
	export function flaw(value: Creatable | any): gracely.Flaw {
		return {
			type: "Authorization.Creatable",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.number == "string" || { property: "number", type: "string | undefined" },
							typeof value.amount == "number" || { property: "amount", type: "number" },
							isoly.Currency.is(value.currency) || { property: "currency", type: "isoly.Currency" },
							authly.Token.is(value.card) ||
								model.Card.Creatable.is(value.card) || {
									property: "card",
									type: "authly.Token | model.Card.Creatable",
								},
							value.descriptor == undefined ||
								typeof value.descriptor == "string" || { property: "descriptor", type: "string | undefined" },
							value.capture == undefined ||
								["auto"].some(v => v == value.capture) || { property: "capture", type: '"auto" | undefined' },
							value.recurring == undefined ||
								["initial", "subsequent"].includes(value.recurring) || {
									property: "recurring",
									type: `"initial" | "subsequent" | undefined`,
								},
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
