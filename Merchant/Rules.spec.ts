import * as model from "../index"

describe("Rule", () => {
	const standardRules: model.Merchant.Rules = {
		master: [
			"reject authorization if authorization.amount>15 !authorization.verification:verified !authorization.recurring:subsequent",
			"reject authorization if authorization.recurring:initial !authorization.verification:verified",
			"reject refund if merchant.refundable<0",
			"reject authorization if !authorization.recurring:subsequent !authorization.card.csc:present",
		],
	}
	it("is", () => {
		expect(model.Merchant.Rules.is(standardRules)).toEqual(true)
	})
	it("parse", () => {
		expect(model.Merchant.Rules.parse(standardRules).length).toEqual(4)
	})
})
