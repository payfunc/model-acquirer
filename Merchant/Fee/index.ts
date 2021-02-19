import * as isoly from "isoly"
import { Transaction as SettlementTransaction } from "../../Settlement/Transaction"
import { Operation } from "../Operation"
import { Transaction as TransactionFee } from "./Transaction"

export type Fee = { [status in Operation]?: number | undefined } &
	{
		[country in isoly.CountryCode.Alpha2]?: TransactionFee | undefined
	} & {
		eea?: TransactionFee | undefined
		other: TransactionFee
	}

export namespace Fee {
	export function is(value: any | Fee): value is Fee {
		return (
			typeof value == "object" &&
			Operation.types.every(v => value[v] == undefined || typeof value[v] == "number") &&
			Object.keys(value)
				.filter(v => Operation.types.every(t => t != v))
				.every(region => TransactionFee.is(value[region]) || region == undefined) &&
			TransactionFee.is(value.other)
		)
	}
	export function apply(transaction: SettlementTransaction, fee: Fee): number {
		return (
			(fee[transaction.type] ?? 0) +
			TransactionFee.apply(
				transaction.scheme,
				transaction.card,
				fee[transaction.area] ?? isoly.CountryCode.Alpha2.isEEA(transaction.area)
					? fee["eea"] ?? fee["other"]
					: fee["other"],
				transaction.gross
			)
		)
	}
	export type Transaction = TransactionFee
	export namespace Transaction {
		export const is = TransactionFee.is
		export const isUnified = TransactionFee.isUnified
		export const apply = TransactionFee.apply
	}
}
