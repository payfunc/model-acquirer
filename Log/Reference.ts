import * as authly from "authly"

export interface Reference {
	type: "order" | "user" | "account" | "merchant" | "authorization"
	id?: authly.Identifier
	number?: string
}

export namespace Reference {
	export function is(value: Reference | any): value is Reference {
		return (
			typeof value == "object" &&
			["order", "user", "account", "merchant", "authorization"].some(t => t == value.type) &&
			(value.id == undefined || authly.Identifier.is(value.id)) &&
			(value.number == undefined || typeof value.number == "string")
		)
	}
}
