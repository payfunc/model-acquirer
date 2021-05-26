export * as base from "@payfunc/model-base"
export { Authorization } from "./Authorization"
export { Capture } from "./Capture"
export { Client } from "./Client"
export { Error } from "./Error"
export { Merchant } from "./Merchant"
export { Refund } from "./Refund"
export { Settlement } from "./Settlement"
export * as State from "./State"
export { Statistics } from "./Statistics"
export { Verification } from "./Verification"

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
