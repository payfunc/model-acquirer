import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import * as base from "@payfunc/model-base"
import { Authorization } from "../Authorization"

export interface Creatable {
	number: string
	items: number | base.Item | base.Item[]
	response?:
		| { type: "method" | "challenge" | "pares"; data: string }
		| { type: "method"; ThreeDSServerTransID: string; timeout: true }
	version?: "2.1.0" | "2.2.0"
	browser?: base.Browser
	currency: isoly.Currency
	card: authly.Token | model.Card.Creatable
	recurring?: Authorization.Recurring
	contact?: base.Contact
	target: string
	category?: "purchase" | "withdrawal"
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
					typeof value.response.data == "string") ||
				(value.response.type == "method" &&
					value.response.timeout == true &&
					typeof value.response.ThreeDSServerTransID == "string")) &&
			(value.version == undefined || ["2.1.0", "2.2.0"].includes(value.version)) &&
			(value.browser == undefined || base.Browser.is(value.browser)) &&
			isoly.Currency.is(value.currency) &&
			(authly.Token.is(value.card) || model.Card.Creatable.is(value.card)) &&
			(value.recurring == undefined || Authorization.Recurring.is(value.recurring)) &&
			(value.contact == undefined || base.Contact.is(value.contact)) &&
			typeof value.target == "string" &&
			(value.category == undefined || value.category == "purchase" || value.category == "withdrawal")
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
									typeof value.response.data == "string") ||
								(value.response.type == "method" &&
									value.response.timeout == true &&
									typeof value.response.ThreeDSServerTransID == "string") || {
									property: "response",
									type:
										'{ type: "pares" | "method" | "challenge"; data: string } | { type: "method"; ThreeDSServerTransID: string; timeout: true }',
								},
							value.version == undefined ||
								["2.1.0", "2.2.0"].includes(value.version) || { property: "version", type: '"2.1.0" | "2.2.0"' },
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
							value.contact == undefined || base.Contact.is(value.contact) || base.Contact.flaw(value.contact),
							typeof value.target == "string" || { property: "target", type: "string" },
							value.category == undefined ||
								value.category == "purchase" ||
								value.category == "withdrawal" || {
									property: "category",
									type: `"purchase" | "withdrawal" | undefined`,
								},
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
