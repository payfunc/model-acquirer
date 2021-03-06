import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import { Fee as MerchantFee } from "./Fee"
import { Operation as MerchantOperation } from "./Operation"
import { Reconciliation as MerchantReconciliation } from "./Reconciliation"
import { Rule as MerchantRule } from "./Rule"
import { Rules as MerchantRules } from "./Rules"

export interface Merchant {
	id: authly.Identifier
	number?: string
	type: "test" | "live"
	agent: string
	reference: string
	descriptor?: string
	name: string
	currency: isoly.Currency
	reconciliation: MerchantReconciliation
	country: isoly.CountryCode.Alpha2
	categoryCode: string //mcc
	rules: MerchantRules
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
			isoly.Currency.is(value.currency) &&
			MerchantReconciliation.is(value.reconciliation) &&
			isoly.CountryCode.Alpha2.is(value.country) &&
			typeof value.categoryCode == "string" &&
			MerchantRules.is(value.rules)
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
							isoly.Currency.is(value.currency) || { property: "currency", type: "isoly.Currency" },
							MerchantReconciliation.is(value.reconciliation) || MerchantReconciliation.flaw(value.reconciliation),
							isoly.CountryCode.Alpha2.is(value.country) || { property: "country", type: "isoly.CountryCode.Alpha2" },
							typeof value.categoryCode == "string" || { property: "categoryCode", type: "string" },
							MerchantRules.is(value.rules) || MerchantRules.flaw(value.rules),
					  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function toCsv(merchants: Merchant[]): string {
		let result = ""
		result += "id,"
		result += "name,"
		result += "mid,"
		result += "mcc,"
		result += "country,"
		result += "reference,"
		result += "currency,"
		result += "\r\n"
		for (const merchant of merchants) {
			result += `"${merchant.id}",`
			result += `"${merchant.name}",`
			result += `"${"8103" + merchant.reference}",`
			result += `"${merchant.categoryCode}",`
			result += `"${merchant.country}",`
			result += `"${merchant.reference}",`
			result += `"${merchant.currency}",`
			result += `\r\n`
		}
		return result
	}
	export type Operation = MerchantOperation
	export namespace Operation {
		export const is = MerchantOperation.is
		export const types = MerchantOperation.types
	}
	export type Fee = MerchantFee
	export namespace Fee {
		export const is = MerchantFee.is
		export const apply = MerchantFee.apply
		export type Transaction = MerchantFee.Transaction
		export namespace Transaction {
			export const is = MerchantFee.Transaction.is
			export const isUnified = MerchantFee.Transaction.isUnified
			export const apply = MerchantFee.Transaction.apply
		}
	}
	export type Rules = MerchantRules
	export namespace Rules {
		export const is = MerchantRules.is
		export const flaw = MerchantRules.flaw
		export const apply = MerchantRules.apply
		export const parse = MerchantRules.parse
	}
	export type Rule = MerchantRule
	export namespace Rule {
		export const is = MerchantRule.is
		export const apply = MerchantRule.apply
		export const parse = MerchantRule.parse
		export const stringify = MerchantRule.stringify
		export const toFlaw = MerchantRule.toFlaw
	}

	export type Reconciliation = MerchantReconciliation
	export namespace Reconciliation {
		export const is = MerchantReconciliation.is
		export const flaw = MerchantReconciliation.flaw
		export type Transaction = MerchantReconciliation.Transaction
		export type Account = MerchantReconciliation.Account
		export namespace Transaction {
			export const is = MerchantReconciliation.Transaction.is
			export const toCsv = MerchantReconciliation.Transaction.toCsv
		}
		export namespace Account {
			export const is = MerchantReconciliation.Account.is
		}
	}
}
