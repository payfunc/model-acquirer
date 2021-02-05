export type Account =
	| {
			bic: string
			iban: string
	  }
	| string

export namespace Account {
	export function is(value: any | Account): value is Account {
		return (
			typeof value == "string" ||
			(typeof value == "object" && typeof value.bic == "string" && typeof value.iban == "string")
		)
	}
}
