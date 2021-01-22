import * as isoly from "isoly"

export interface Change {
	number?: string
	created: isoly.DateTime
	amount: number
}
