import * as gracely from "gracely"
export namespace Error {
	export function databaseFailure(
		error: "authorization not found" | "merchant not found" | "backend problem",
		message: string
	): gracely.Error {
		return gracely.server.databaseFailure(message, error)
	}
	export function unauthorized(): gracely.Error {
		return gracely.client.unauthorized("unauthorized")
	}
	export function backendFailure(details?: any): gracely.Error {
		return gracely.server.backendFailure("Intergiro", details, undefined, "backend problem")
	}
	export function flawedContent(
		error: "invalid input" | "rule violation" | "verification required",
		flaw: gracely.Flaw
	): gracely.Error {
		return gracely.client.flawedContent(flaw, error)
	}
	export function invalidContent(
		error: "invalid transaction" | "invalid input" | "rule violation",
		type: string,
		description: string,
		details?: any
	): gracely.Error {
		return gracely.client.invalidContent(type, description, details, error)
	}
	export function malformedContent(
		error:
			| "invalid card number"
			| "unsupported card"
			| "invalid expire date"
			| "invalid csc"
			| "invalid currency"
			| "invalid descriptor"
			| "card expired"
			| "card lost or stolen"
			| "card restricted"
			| "blocked merchant"
			| "card declined"
			| "amount limit"
			| "3ds authentication failure"
			| "suspected fraud"
			| "3ds problem"
			| "insufficient funds"
			| "verification required",
		property: string,
		type: string,
		description: string,
		details?: any
	): gracely.Error {
		return gracely.client.malformedContent(property, type, description, details, error)
	}
	export function invalidPathArgument(path: string, name: string, type: string, description: string): gracely.Error {
		return gracely.client.invalidPathArgument(path, name, type, description, "invalid input")
	}
	export function invalidQueryArgument(name: string, type: string, description: string): gracely.Error {
		return gracely.client.invalidQueryArgument(name, type, description, "invalid input")
	}
	export function misconfigured(key: string, description: string): gracely.Error {
		return gracely.server.misconfigured(key, description, "backend problem")
	}
	export function unknown(details?: any): gracely.Error {
		return gracely.server.unknown(details, "unknown error")
	}
	export function unavailable(): gracely.Error {
		return gracely.server.unavailable("backend problem")
	}
	export type Code =
		| "3ds problem"
		| "3ds authentication failure"
		| "acquirer error"
		| "amount limit"
		| "authentication required"
		| "authorization not found"
		| "backend problem"
		| "blocked merchant"
		| "card declined"
		| "card lost or stolen"
		| "card restricted"
		| "card expired"
		| "invalid card number"
		| "invalid csc"
		| "invalid currency"
		| "invalid descriptor"
		| "invalid expire date"
		| "invalid input"
		| "invalid transaction"
		| "insufficient funds"
		| "merchant not found"
		| "rule violation"
		| "suspected fraud"
		| "unauthorized"
		| "unknown error"
		| "unsupported card"
		| "verification required"

	export namespace Code {
		export function is(value: any | Code): value is Code {
			return types.includes(value)
		}
		export const types: Code[] = [
			"3ds problem",
			"3ds authentication failure",
			"acquirer error",
			"amount limit",
			"authentication required",
			"authorization not found",
			"backend problem",
			"blocked merchant",
			"card declined",
			"card lost or stolen",
			"card restricted",
			"card expired",
			"invalid card number",
			"invalid csc",
			"invalid currency",
			"invalid descriptor",
			"invalid expire date",
			"invalid input",
			"invalid transaction",
			"insufficient funds",
			"merchant not found",
			"rule violation",
			"suspected fraud",
			"unauthorized",
			"unknown error",
			"unsupported card",
			"verification required",
		]
	}
}
