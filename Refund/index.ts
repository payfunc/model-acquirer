import * as isoly from "isoly"
import * as authly from "authly"
import { Creatable as RCreatable } from "./Creatable"

export class Refund {
	id: authly.Identifier
	number?: string
	reference: string
	created: isoly.DateTime
	amount: number
	descriptor?: string
}

export namespace Refund {
	export type Creatable = RCreatable
}
