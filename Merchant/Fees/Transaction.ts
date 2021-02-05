import * as model from "@payfunc/model-card"
//Cost of a transaction
export type Transaction = {
	[scheme in model.Card.Scheme]:
		| {
				debit: {
					percentage: number
					minimum: number
				}
				credit: {
					percentage: number
					minimum: number
				}
		  }
		| undefined
}

export namespace Transaction {
	export function is(value: any | Transaction): value is Transaction {
		return (
			typeof value == "object" &&
			Object.keys(value).every(
				scheme =>
					model.Card.Scheme.is(scheme) &&
					(value[scheme] == undefined ||
						(typeof value[scheme] == "object" &&
							typeof value[scheme].debit == "object" &&
							typeof value[scheme].debit.percentage == "number" &&
							typeof value[scheme].credit == "object" &&
							typeof value[scheme].credit.percentage == "number"))
			)
		)
	}
}
