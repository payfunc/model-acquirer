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
		expect(flaw.type).toEqual("Rule Violation")
	})
	it("parse", () => {
		const rule = "reject authorization has(verification)"
		const parsed = Rule.parse(rule)
		expect(parsed?.condition.is({ card: { verification: "something" } })).toEqual(true)
		expect(Rule.parse(rule)).toEqual({
			action: "reject",
			operation: "authorization",
			condition: selectively.has("verification"),
			verification: true,
		})
	})
	it("invert rules", () => {
		const simple = Rule.parse("reject authorization !has(verification)")
		expect(simple?.condition.is({ notVerification: "string or something" })).toEqual(true)
		expect(simple?.condition.is({ verification: "string or something" })).toEqual(false)
		expect(simple?.condition.is({ nested: { verification: "string or something" } })).toEqual(false)
	})
	it("standard rules", () => {
		const simple = Rule.parse("reject authorization ($authorized>=1)")
		const authorization = Rule.parse("reject authorization ($authorized>$verificationLimit)")
		const refund = Rule.parse("reject refund $captured<$refunded")
		const capture = Rule.parse("reject capture $authorized<$captured")
		const value = { verificationLimit: 249, authorized: 250, captured: 251, refunded: 252 }
		expect(simple?.condition.is(value)).toEqual(true)
		expect(authorization?.condition.is(value)).toEqual(true)
		expect(refund?.condition.is(value)).toEqual(true)
		expect(capture?.condition.is(value)).toEqual(true)
	})
})
