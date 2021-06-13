import * as selectively from "selectively"
import { Rule } from "./index"

describe("Rule", () => {
	const rule: Rule = {
		action: "reject",
		operation: "authorization",
		condition: selectively.parse("exists field"),
		verification: false,
	}
	it("Typeguard", () => {
		expect(Rule.is(rule)).toEqual(true)
	})
	it("stringify", () => {
		expect(Rule.stringify(rule)).toEqual("reject authorization exists field")
	})
	it("toError", () => {
		const flaw = Rule.toFlaw([rule])
		expect(flaw.type).toEqual("rule violation")
	})
})
