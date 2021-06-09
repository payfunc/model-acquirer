import * as isoly from "isoly"
import * as base from "@payfunc/model-base"
import { Recurring } from "../Recurring"

export interface Settlement {
	merchant: string
	number: string
	date: isoly.DateTime
	type: "settlement"
	status: "fail" | "success" | "pending"
	step: "preauthorization" | "authorization" | "postauthorization"
	items: number | base.Item | base.Item[]
	currency: isoly.Currency
	target: string
	browser?: base.Browser
	customer?: base.Customer
	recurring?: Recurring
}

export namespace Settlement {
	export function is(value: any | Settlement): value is Settlement {
		return (
			typeof value == "object" &&
			typeof value.merchant == "string" &&
			typeof value.number == "string" &&
			isoly.DateTime.is(value.date) &&
			value.type == "settlement" &&
			["fail", "success", "pending"].includes(value.status) &&
			["preauthorization", "authorization", "postauthorization"].includes(value.step) &&
			(typeof value.items == "number" ||
				base.Item.is(value.items) ||
				(Array.isArray(value.items) && value.items.every(base.Item.is))) &&
			isoly.Currency.is(value.currency) &&
			typeof value.target == "string" &&
			(value.browser == undefined || base.Browser.is(value.browser)) &&
			(value.customer == undefined || base.Customer.is(value.customer)) &&
			(value.recurring == undefined || Recurring.is(value.recurring))
		)
	}
}
