import { Authorization } from "./Authorization"
import { Capture } from "./Capture"
import { Client } from "./Client"
import { Merchant } from "./Merchant"
import { Refund } from "./Refund"
import { Settlement } from "./Settlement"
import * as State from "./State"
import { Statistics } from "./Statistics"

export { Authorization, Capture, Client, Merchant, Refund, Settlement, State, Statistics }

export function clear<T>(value: T): T
export function clear(value: Record<string, any>): Record<string, any> {
	for (const entry of Object.entries(value)) {
		if (entry[1] == undefined)
			delete value[entry[0]]
		else if (typeof entry[1] == "object")
			value[entry[0]] = clear(entry[1])
	}
	return value
}
