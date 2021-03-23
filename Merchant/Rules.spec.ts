import * as model from "../index"

describe("Rule", () => {
	const rules: model.Merchant.Rules = {
		master: [
			"reject authorization !has(verification)",
			"reject authorization verification:(noServiceAvailable | rejected)",
			"reject refund ($amount > $refundable)",
		],
	}
	it("is", () => {
		expect(model.Merchant.Rules.is(rules)).toEqual(true)
	})
	it("parse", () => {
		expect(model.Merchant.Rules.parse(rules).length).toEqual(3)
	})
})
