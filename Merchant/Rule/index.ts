import * as gracely from "gracely"
import * as selectively from "selectively"
import { Operation } from "../Operation"
import { Action } from "./Action"

export interface Rule {
	action: Action
	operation: Operation
	condition: selectively.Rule
	verification: boolean
}

export namespace Rule {
	export function is(value: any | Rule): value is Rule {
		return (
			typeof value == "object" &&
			Action.is(value.action) &&
			Operation.is(value.operation) &&
			typeof value.condition == "object" &&
			typeof value.condition.is == "function" &&
			typeof value.condition.filter == "function" &&
			typeof value.condition.toString == "function" &&
			typeof value.verification == "boolean"
		)
	}
	export function stringify(rule: Rule): string {
		return [rule.action, rule.operation, rule.condition.toString()].join(" ")
	}
	export function parse(rule: string): Rule | undefined {
		const split = rule.split(" ")
		const result = {
			action: split[0],
			operation: split[1],
			condition: selectively.parse(
				split
					.splice(2, split.length - 2)
					.join(" ")
					.replace(/^\s?if/, "")
			),
			verification: rule.includes("verification"),
		}
		return is(result) ? result : undefined
	}
	export function apply(value: any, rule: Rule): boolean {
		return rule.condition.is(value)
	}
	export function toFlaw(failed: Rule[]): gracely.Flaw & { type: "verification required" | "rule violation" } {
		return {
			type: failed.every(f => f.verification) ? "verification required" : "rule violation",
			flaws: failed.map(rule => {
				return { type: rule.action, condition: rule.condition.toString() }
			}),
		}
	}
}
