import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"

export interface Creatable {
	number: string
	items: number | Item | Item[]
	response?: { type: "method" | "challenge" | "pares"; data: string }
	browser?: Browser
	currency: isoly.Currency
	card: authly.Token | model.Card.Creatable
	recurring?: "initial" | "subsequent"
	customer?: Customer
}

export type Verification =
	| {
			type: "pares"
			data: common.Pares
	  }
	| {
			type: "method" | "challenge"
			data: {
				authentication: string
				status: "A" | "N" | "U" | "Y" | "C" | "R"
				reference: {
					server: string // threeDSServerTransID
					directory: string //dsTransID
				}
			}
	  }
