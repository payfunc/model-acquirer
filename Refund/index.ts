import * as isoly from "isoly"
import { Creatable as RCreatable } from "./Creatable"

export class Refund {
	number?: string
	created: isoly.DateTime
	approved?: isoly.DateTime
	amount: number
	descriptor?: string
	status: "approved" | "pending"
}

export namespace Refund {
	export type Creatable = RCreatable
}
