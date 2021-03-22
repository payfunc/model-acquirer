import * as gracely from "gracely"
import { Merchant } from "../Merchant"
import * as State from "../State"
import { Operation } from "./Operation"
import { Rule } from "./Rule"

export type Rules = Record<string, string[] | undefined> & Record<"master", string[]>

export namespace Rules {
	export function is(value: any | Rules): value is Rules {
		return Array.isArray(value) && value.every(rule => typeof rule == "string" && !!Rule.parse(rule))
	}
	export function flaw(value: any | Rules): gracely.Flaw {
		return {
			type: "Merchant.Rules",
			flaws: !Array.isArray(value)
				? undefined
				: ([
						value.every(rule => typeof rule == "string" && !!Rule.parse(rule)) || {
							property: "rule",
							type: "string[]",
							condition: "All rules have to be parsable to Merchant.Rule datatype.",
						},
				  ].filter(gracely.Flaw.is) as gracely.Flaw[]),
		}
	}
	export function parse(rules: Rules): Rule[] {
		return rules.map(rule => Rule.parse(rule)).filter(Rule.is)
	}
	export function apply(
		value: State.PreAuthorization | State.PostAuthorization,
		rules: Rules | Rule[],
		operation: Operation
	): true | gracely.Flaw {
		let result: true | gracely.Flaw
		if (Rules.is(rules))
			result = rules.length == 0 ? true : apply(value, parse(rules), operation)
		else {
			const failed = rules
				.filter(rule => rule.operation == operation || rule.operation == "all")
				.reduce<Rule[]>((failed, rule) => (Rule.apply(value, rule) ? [...failed, rule] : failed), [])
			result = failed.length == 0 ? true : Rule.toFlaw(failed)
		}
		return result
	}
}

export interface RuleValue {
	refundable?: number
	verification?: "verified" | "noServiceAvailable" | "rejected"
	risk: number
	amount: number
	authorized?: number
	captured?: number
	merchant?: Partial<Merchant>
}
