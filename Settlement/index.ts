import { Conversion } from "./Conversion"
import { Settlement as modelSettlement } from "./Settlement"
import { Transaction as SettlementTransaction } from "./Transaction"

export type Settlement = modelSettlement
export namespace Settlement {
	export const toCsv = Conversion.toCsv
	export const toDetailedCsv = Conversion.toDetailedCsv
	export const is = modelSettlement.is
	export const toCustomer = modelSettlement.toCustomer
	export type Transaction = SettlementTransaction
	export namespace Transaction {
		export const is = SettlementTransaction.is
		export const toCustomer = SettlementTransaction.toCustomer
	}
}
