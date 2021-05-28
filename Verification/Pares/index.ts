import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as http from "cloud-http"
import { Error } from "../../Error"

export interface Pares {
	cavv: string
	xid: string
	eci: "0" | "1" | "2" | "5" | "6" | "7"
	status: "Y" | "U" | "A" | "N"
	amount?: number
	cavv_algorithm?: string
	currency?: isoly.Currency
	last4?: string
	merchant_id?: string
}
export namespace Pares {
	export function is(value: any | Pares): value is Pares {
		return (
			typeof value == "object" &&
			typeof value.cavv == "string" &&
			typeof value.xid == "string" &&
			["0", "1", "2", "5", "6", "7"].includes(value.eci) &&
			["Y", "U", "A", "N"].includes(value.status)
		)
	}
	export function fromEci(eci: "0" | "1" | "2" | "5" | "6" | "7"): "Y" | "A" | "N" | undefined {
		let result: "Y" | "A" | "N" | undefined
		switch (eci) {
			case "2":
			case "5":
				result = "Y"
				break
			case "6":
			case "1":
				result = "A"
				break
			case "0":
			case "7":
				result = "N"
				break
			default:
				result = undefined
		}
		return result
	}
	export async function check(
		configuration: { url: string; key: string },
		pares: string | Record<string, any> | undefined
	): Promise<Pares | gracely.Error> {
		const response = !configuration
			? Error.unauthorized()
			: typeof pares != "string"
			? { body: { pares } }
			: pares.startsWith("eyJhbW91bnQ") // All internally simulated pares starts with these sequence
			? { body: unpackSimulated(pares) }
			: await http
					.fetch({
						url: configuration.url + "/check",
						method: "POST",
						header: {
							contentType: "application/x-www-form-urlencoded",
							authorization: `Basic ${authly.Base64.encode(configuration.key + ":", "standard", "=")}`,
						},
						body: { pares },
					})
					.catch(_ => undefined)
		const result = !response ? Error.unavailable() : await response.body
		if (typeof result == "object")
			result.status = result.status ?? fromEci(result.eci)
		return gracely.Error.is(result) || is(result)
			? result
			: Error.malformedContent("3ds problem", "verification", "Pares", "Cannot unpack pares.")
	}
	function unpackSimulated(pares: string): Pares | undefined {
		let result: Pares | undefined
		try {
			result = JSON.parse(new authly.TextDecoder().decode(authly.Base64.decode(pares, "url")))
			if (result?.cavv == "")
				result.cavv = "123456789012345678901234"
		} catch (_) {
			result = undefined
		}
		return result
	}
}
