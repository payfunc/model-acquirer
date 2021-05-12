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
			(value.customer == undefined || base.Customer.is(value.customer))
		)
	}
}
