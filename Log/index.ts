import * as isoly from "isoly"
import * as authly from "authly"
import { Entry as LogEntry } from "./Entry"
import { Method as LogMethod } from "./Method"
import { Reference as LogReference } from "./Reference"

export interface Log {
	reference: LogReference
	agent: authly.Identifier
	merchant?: authly.Identifier
	client?: string
	resource: { method: LogMethod; url: string }
	created: isoly.DateTime
	entries: LogEntry[]
}

export namespace Log {
	export function is(value: Log | any): value is Log {
		return (
			typeof value == "object" &&
			LogReference.is(value.reference) &&
			authly.Identifier.is(value.agent) &&
			(value.merchant == undefined || authly.Identifier.is(value.merchant, 8)) &&
			(value.client == undefined || typeof value.client == "string") &&
			typeof value.resource == "object" &&
			LogMethod.is(value.resource.method) &&
			typeof value.resource.url == "string" &&
			isoly.DateTime.is(value.created) &&
			Array.isArray(value.entries) &&
			value.entries.every(LogEntry.is)
		)
	}
	export type Reference = LogReference
	export namespace Reference {
		export const is = LogReference.is
	}
	export type Entry = LogEntry
	export namespace Entry {
		export const is = LogEntry.is
	}
	export type Method = LogMethod
	export namespace Method {
		export const is = LogMethod.is
	}
}
