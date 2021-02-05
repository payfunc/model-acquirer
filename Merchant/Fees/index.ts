import * as isoly from "isoly"
import { Transaction as TransactionFees } from "./Transaction"
import { Type as FeesType, typeArray } from "./Type"

export type Fees = { [status in FeesType]: number | undefined } &
	{
		[country in isoly.CountryCode.Alpha2]: TransactionFees | undefined
	} & {
		eea: TransactionFees | undefined
		other: TransactionFees
	}

export namespace Fees {
	export function is(value: any | Fees): value is Fees {
		return (
			typeof value == "object" &&
			typeArray.every(v => value[v] == undefined || typeof value[v] == "number") &&
			Object.keys(value)
				.filter(v => typeArray.every(t => t != v))
				.every(region => TransactionFees.is(value[region]) || region == undefined) &&
			TransactionFees.is(value.other)
		)
	}
	export type Type = FeesType
	export type Transaction = TransactionFees
}
