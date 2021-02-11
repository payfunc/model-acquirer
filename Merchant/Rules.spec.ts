import * as model from "../index"

describe("Rule", () => {
	const rules: model.Merchant.Rules = ["reject authorization !has(verification)"]
	it("is", () => {
		expect(model.Merchant.Rules.is(rules)).toEqual(true)
	})
	it("parse", () => {
		expect(model.Merchant.Rules.parse(rules).length).toEqual(1)
	})
	it("apply", () => {
		expect(model.Merchant.Rules.apply({ verification: "someting" }, rules, "authorization")).toEqual(true)
		expect(model.Merchant.Rules.apply({ notVerification: "someting" }, rules, "authorization")).toEqual({
			type: "Rule Violation",
			flaws: [{ type: "reject", condition: "!(has(verification))" }],
		})
		expect(model.Merchant.Rules.apply({ nested: { verification: "someting" } }, rules, "authorization")).toEqual(true)
		expect(model.Merchant.Rules.apply({ nested: { notVerification: "someting" } }, rules, "authorization")).toEqual({
			type: "Rule Violation",
			flaws: [{ type: "reject", condition: "!(has(verification))" }],
		})
		expect(
			model.Merchant.Rules.apply({ nested: { verification: {  } } }, rules, "authorization")
		).toEqual(true)
	})
})
