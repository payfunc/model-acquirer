import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Creatable as ACreatable } from "./Creatable"

export interface Authorization {
	id: authly.Identifier
	number?: string
	reference: string
	token: authly.Token
	created: isoly.DateTime
	amount: number
	currency: isoly.Currency
	card: authly.Token | model.Card
	descriptor?: string
	client?: model.Browser
	capture?: Capture[]
	refund?: Refund[]
	void?: isoly.DateTime
}

export namespace Authorization {
	export type Creatable = ACreatable
}
