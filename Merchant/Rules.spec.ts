import * as model from "../index"

describe("Rule", () => {
	const rules: model.Merchant.Rules = [
		"reject authorization !has(verification)",
		"reject authorization verification:(noServiceAvailable | rejected)",
		"reject refund ($amount > $refundable)",
	]
	const captured = {
		"2021-01-07": 100,
		"2021-01-14": 150,
	}
	const settled = {
		"2021-01-10": 95,
	}
	const fees = {
		"2021-01-10": 5,
	}
	const statistic: model.Statistics = {
		merchant: "testtest",
		currency: "SEK",
		captured,
		settled,
		fees,
		refundable: model.Statistics.sum(captured) - model.Statistics.sum(settled),
	}
	it("is", () => {
		expect(model.Merchant.Rules.is(rules)).toEqual(true)
	})
	it("parse", () => {
		expect(model.Merchant.Rules.parse(rules).length).toEqual(3)
	})
	it("apply authorization", () => {
		expect(model.Merchant.Rules.apply({ statistic, verification: "verified" }, rules, "authorization")).toEqual(true)
		expect(
			model.Merchant.Rules.apply({ statistic, verification: "noServiceAvailable" }, rules, "authorization")
		).toEqual({
			type: "verification required",
			flaws: [{ type: "reject", condition: "verification:(noServiceAvailable | rejected)" }],
		})
		expect(model.Merchant.Rules.apply({ statistic, verification: "rejected" }, rules, "authorization")).toEqual({
			type: "verification required",
			flaws: [{ type: "reject", condition: "verification:(noServiceAvailable | rejected)" }],
		})
		expect(model.Merchant.Rules.apply({ statistic }, rules, "authorization")).toEqual({
			type: "verification required",
			flaws: [{ type: "reject", condition: "!(has(verification))" }],
		})
	})
	it("apply refund", () => {
		expect(model.Merchant.Rules.apply({ refund: { amount: 30 }, statistic }, rules, "refund")).toEqual(true)
		expect(model.Merchant.Rules.apply({ refund: { amount: 300 }, statistic }, rules, "refund")).toEqual({
			type: "Rule Violation",
			flaws: [{ type: "reject", condition: "($amount > $refundable)" }],
		})
	})
})
