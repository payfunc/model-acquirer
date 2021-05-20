import * as gracely from "gracely"
import * as isoly from "isoly"
import { Account as ReconciliationAccount } from "../Account"
import { Fee } from "../Fee"
import { Transaction as ReconciliationTransaction } from "./Transaction"

export interface Reconciliation {
	account: ReconciliationAccount | { [currency in isoly.Currency | "default"]?: ReconciliationAccount }
	costPlus?: true
	fees: Fee
	reserves?: {
		percentage: number
		days?: number
	}
}

export namespace Reconciliation {
	export function is(value: any | Reconciliation): value is Reconciliation {
		return (
			typeof value == "object" &&
			(ReconciliationAccount.is(value.account) ||
				(typeof value.account == "object" &&
					Object.entries(value.account).every(
						([currency, account]) =>
							(isoly.Currency.is(currency) || currency == "default") && ReconciliationAccount.is(account)
					))) &&
			(value.costPlus == undefined || value.costPlus == true) &&
			Fee.is(value.fees) &&
			(value.reserves == undefined ||
				(typeof value.reserves == "object" &&
					typeof value.reserves.percentage == "number" &&
					(value.reserves.days == undefined || typeof value.reserves.days == "number")))
		)
	}
	export function flaw(value: any | Reconciliation): gracely.Flaw {
		return {
			type: "Merchant.Reconciliation",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							ReconciliationAccount.is(value.account) ||
								(typeof value.account == "object" &&
									Object.entries(value.account).every(
										([currency, account]) =>
											(isoly.Currency.is(currency) || currency == "default") && ReconciliationAccount.is(account)
									)) || {
									property: "account",
									type: 'Merchant.Account | { [currency in isoly.Currency | "default"]?: Merchant.Account }',
								},
							value.costPlus == undefined ||
								value.costPlus == true || { property: "costPlus", type: "undefined | true" },
							Fee.is(value.fees) || { property: "fees", type: "Merchant.Fee" },
							typeof value.reserves == "object" || { property: "reserves", type: "object" },
							typeof value.reserves.percentage == "number" || { property: "reserves.percentage", type: "number" },
							value.reserves.days == undefined ||
								typeof value.reserves.days == "number" || { property: "reserves.days", type: "number | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export type Transaction = ReconciliationTransaction
	export namespace Transaction {
		export const is = ReconciliationTransaction.is
		export const toCsv = ReconciliationTransaction.toCsv
	}

	export type Account = ReconciliationAccount
	export namespace Account {
		export const is = ReconciliationAccount.is
	}
}
