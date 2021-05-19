import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import * as base from "@payfunc/model-base"

export interface Creatable {
	number: string
	items: number | base.Item | base.Item[]
	response?: { type: "method" | "challenge" | "pares"; data: string }
	browser?: base.Browser
	currency: isoly.Currency
	card: authly.Token | model.Card.Creatable
	recurring?: "initial" | "subsequent"
	customer?: base.Customer
	target: string
}
export namespace Creatable {
	export function is(value: any | Creatable): value is Creatable {
		return (
			typeof value == "object" &&
			typeof value.number == "string" &&
			(typeof value.items == "number" ||
				base.Item.is(value.items) ||
				(Array.isArray(value.items) && value.items.every(base.Item.is))) &&
			(value.response == undefined ||
				(typeof value.response == "object" &&
					["method", "challenge", "pares"].includes(value.response.type) &&
					typeof value.response.data == "string")) &&
			(value.browser == undefined || base.Browser.is(value.browser)) &&
			isoly.Currency.is(value.currency) &&
			(authly.Token.is(value.card) || model.Card.Creatable.is(value.card)) &&
			(value.recurring == undefined || ["initial", "subsequent"].includes(value.recurring)) &&
			(value.customer == undefined || base.Customer.is(value.customer)) &&
			typeof value.target == "string"
		)
	}
	export function flaw(value: Creatable | any): gracely.Flaw {
		return {
			type: "Verification.Creatable",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							typeof value.number == "string" || { property: "number", type: "string" },
							typeof value.items == "number" ||
								base.Item.is(value.items) ||
								(Array.isArray(value.items) && value.items.every(base.Item.is)) || {
									property: "items",
									type: "number | Item | Item[]",
								},
							value.response == undefined ||
								(typeof value.response == "object" &&
									["method", "challenge", "pares"].includes(value.response.type) &&
									typeof value.response.data == "string") || {
									property: "response",
									type: '{ type: "pares" | "method" | "challenge"; data: string }',
								},
							value.browser == undefined ||
								base.Browser.is(value.browser) || { property: "browser", type: "base.Browser | undefined" },
							isoly.Currency.is(value.currency) || { property: "currency", type: "isoly.Currency" },
							authly.Token.is(value.card) ||
								model.Card.Creatable.is(value.card) || { property: "card", type: "Card.Creatable | authly.Token" },
							value.recurring == undefined ||
								["initial", "subsequent"].includes(value.recurring) || {
									property: "recurring",
									type: '"initial" | "subsequent" | undefined',
								},
							value.customer == undefined || base.Customer.is(value.customer) || base.Customer.flaw(value.customer),
							typeof value.target == "string" || { property: "target", type: "string" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
