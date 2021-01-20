import * as isoly from "isoly"
import * as authly from "authly"
import { Creatable as CCreatable } from "./Creatable"

export class Capture {
	id: authly.Identifier
	number?: string
	reference: string
	created: isoly.DateTime
	amount: number
	descriptor?: string
}

export namespace Capture {
	export type Creatable = CCreatable
}
