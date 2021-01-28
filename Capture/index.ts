import * as isoly from "isoly"
import { Creatable as CCreatable } from "./Creatable"

export class Capture {
	number?: string
	created: isoly.DateTime
	approved?: isoly.DateTime
	amount: number
	descriptor?: string
	status: "approved" | "pending"
}

export namespace Capture {
	export type Creatable = CCreatable
}
