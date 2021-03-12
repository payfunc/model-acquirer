import * as model from "@payfunc/model-card"
//Cost of a transaction
export type Transaction = {
	[scheme in model.Card.Scheme]?:
		| {
				debit: {
					percentage: number
					minimum?: number
				}
				credit: {
					percentage: number
					minimum?: number
				}
		  }
		| {
				percentage: number
				minimum?: number
		  }
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
							typeof value[scheme].percentage == "number" &&
							(value[scheme].minimum == undefined || typeof value[scheme].minimum == "number")) ||
						(typeof value[scheme] == "object" &&
							typeof value[scheme].debit == "object" &&
							typeof value[scheme].debit.percentage == "number" &&
							(value[scheme].debit.minimum == undefined || typeof value[scheme].debit.minimum == "number") &&
							typeof value[scheme].credit == "object" &&
							typeof value[scheme].credit.percentage == "number" &&
							(value[scheme].credit.minimum == undefined || typeof value[scheme].credit.minimum == "number")))
			)
		)
	}
	export function isUnified(value: any): value is { percentage: number; minimum?: number } {
		return typeof value == "object" && value.debit == undefined && value.credit == undefined
	}
	export function apply(
		scheme: model.Card.Scheme,
		card: "debit" | "credit",
		transaction: Transaction,
		gross: number
	): number {
		let result: number
		let feeModel = transaction[scheme]
		if (!feeModel)
			result = 0
		else {
			feeModel = isUnified(feeModel) ? feeModel : feeModel[card]
			const fee = (feeModel.percentage / 100) * gross
			result = fee < (feeModel.minimum ?? 0) ? feeModel.minimum ?? 0 : fee
		}
		return result
	}
}
