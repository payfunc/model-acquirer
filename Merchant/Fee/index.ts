import * as isoly from "isoly"
import { Transaction as TransactionFee } from "./Transaction"
import { Type as FeeType, typeArray } from "./Type"

export type Fee = { [status in FeeType]: number | undefined } &
	{
		[country in isoly.CountryCode.Alpha2]: TransactionFee | undefined
	} & {
		eea: TransactionFee | undefined
		other: TransactionFee
	}

export namespace Fee {
	export function is(value: any | Fee): value is Fee {
		return (
			typeof value == "object" &&
			typeArray.every(v => value[v] == undefined || typeof value[v] == "number") &&
			Object.keys(value)
				.filter(v => typeArray.every(t => t != v))
				.every(region => TransactionFee.is(value[region]) || region == undefined) &&
			TransactionFee.is(value.other)
		)
	}
	export type Type = FeeType
	export type Transaction = TransactionFee
}
