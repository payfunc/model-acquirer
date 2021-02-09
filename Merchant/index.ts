import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import { Reconciliation as MerchantReconciliation } from "./Reconciliation"
import { Rules } from "./Rules"
export interface Merchant {
	id: authly.Identifier
	number?: string
	type: "test" | "live"
	agent: string
	reference: string
	descriptor?: string
	name: string
	reconciliation: MerchantReconciliation
	country: isoly.CountryCode.Alpha2
	categoryCode: string //mcc
	rules: Rules
}

export namespace Merchant {
	export function is(value: any | Merchant): value is Merchant {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id, 8) &&
			(value.number == undefined || typeof value.number == "string") &&
			(value.type == "test" || value.type == "live") &&
			typeof value.agent == "string" &&
			typeof value.reference == "string" &&
			(value.descriptor == undefined || typeof value.descriptor == "string") &&
			typeof value.name == "string" &&
			MerchantReconciliation.is(value.reconciliation) &&
			isoly.CountryCode.Alpha2.is(value.country) &&
			typeof value.categoryCode == "string" &&
			Rules.is(value.rules)
		)
	}
	export function flaw(value: any | Merchant): gracely.Flaw {
		return {
			type: "Merchant",
			flaws:
				typeof value != "object"
					? undefined
					: ([
							authly.Identifier.is(value.id, 8) || { property: "id", type: "authly.Identifier" },
							value.number == undefined ||
								typeof value.number == "string" || { property: "number", type: "string | undefined" },
							value.type == "test" || value.type == "live" || { property: "type", type: '"test" | "live"' },
							typeof value.agent == "string" || { property: "agent", type: "string" },
							typeof value.reference == "string" || { property: "reference", type: "string" },
							value.descriptor == undefined ||
								typeof value.descriptor == "string" || { property: "descriptor", type: "string | undefined" },
							typeof value.name == "string" || { property: "name", type: "string" },
							MerchantReconciliation.is(value.reconciliation) || MerchantReconciliation.flaw(value.reconciliation),
							isoly.CountryCode.Alpha2.is(value.country) || { property: "country", type: "isoly.CountryCode.Alpha2" },
							typeof value.categoryCode == "string" || { property: "categoryCode", type: "string" },
							Rules.is(value.rules) || Rules.flaw(value.rules),
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export type Reconciliation = MerchantReconciliation
	export namespace Reconciliation {
		export const is = MerchantReconciliation.is
		export const flaw = MerchantReconciliation.flaw
		export type Transaction = MerchantReconciliation.Transaction
		export namespace Transaction {
			export const is = MerchantReconciliation.Transaction.is
		}
	}
}
