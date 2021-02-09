import * as gracely from "gracely"
import * as isoly from "isoly"
import { Account } from "./Account"
import { Fees } from "./Fees"

export interface Reconciliation {
	account: Account
	currency: isoly.Currency
	fees: Fees
	reserves?: {
		percentage: number
		days?: number
	}
}

export namespace Reconciliation {
	export function is(value: any | Reconciliation): value is Reconciliation {
		return (
			typeof value == "object" &&
			Account.is(value.account) &&
			isoly.Currency.is(value.currency) &&
			Fees.is(value.fees) &&
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
							Account.is(value.account) || { property: "accoun", type: "Merchant.Account" },
							isoly.Currency.is(value.currency) || { property: "currency", type: "isoly.Currency" },
							Fees.is(value.fees) || { property: "fees", type: "Merchant.Fees" },
							typeof value.reserves == "object" || { property: "reserves", type: "object" },
							typeof value.reserves.percentage == "number" || { property: "reserves.percentage", type: "number" },
							value.reserves.days == undefined ||
								typeof value.reserves.days == "number" || { property: "reserves.days", type: "number | undefined" },
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
}
