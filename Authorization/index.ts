import * as isoly from "isoly"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Change as AChange } from "./Change"
import { Creatable as ACreatable } from "./Creatable"

export interface Authorization {
	id: authly.Identifier
	number?: string
	reference: string
	created: isoly.DateTime
	amount: number
	currency: isoly.Currency
	card: model.Card
	descriptor?: string
	change?: AChange[]
	capture?: Capture[]
	refund?: Refund[]
	void?: isoly.DateTime
}

export namespace Authorization {
	export type Creatable = ACreatable
	export type Change = AChange
}
