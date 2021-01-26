import * as isoly from "isoly"
import { Creatable as ChangeCreatable } from "./Creatable"

export interface Change {
	number?: string
	created: isoly.DateTime
	amount: number
}

export namespace Change {
	export type Creatable = ChangeCreatable
}
