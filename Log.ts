import * as isoly from "isoly"
import * as authly from "authly"

export interface Log {
	reference: {
		type: "order" | "user" | "account" | "merchant" | "authorization"
		id?: authly.Identifier
		number?: string
	}
	agent: authly.Identifier
	merchant?: authly.Identifier
	client?: string
	resource: { method: "GET"; url: string }
	created: isoly.DateTime
	entries: Entry[]
}

interface Entry {
	level: "trace" | "log" | "warning" | "exception"
	point: string | "request" | "response" | "catch"
	data: Record<string, any>
}
