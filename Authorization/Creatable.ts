import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"

export interface Creatable {
	id?: authly.Identifier
	number?: string
	amount: number
	currency: isoly.Currency
	card: authly.Token | model.Card.Creatable
	descriptor?: string
	capture?: "auto"
}
