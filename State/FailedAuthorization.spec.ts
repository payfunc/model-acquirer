import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import * as acquirer from "../index"

describe("State.FailedAuthorization tests", () => {
	it("State.FailedAuthorization test", () => {
		const merchant: acquirer.Merchant = {
			id: "testtest",
			type: "test",
			agent: "master",
			categoryCode: "1234",
			country: "SE",
			name: "Test Merchant",
			reconciliation: { account: "exampleAccount", currency: "SEK", fees: { other: {} } },
			reference: "123456",
			rules: { master: [] },
		}
		const statistics: acquirer.Statistics = {
			merchant: "testtest",
			currency: "SEK",
			captured: {},
			refundable: 130,
			settled: {},
			fees: {},
		}
		const card: model.Card.Creatable = {
			pan: "4111111111111111",
			expires: [2, 28],
			csc: "987",
		}
		const authorization: acquirer.Authorization.Creatable & { card: model.Card.Creatable } = {
			amount: 100,
			currency: "SEK",
			descriptor: "test transaction",
			number: "12345678",
			card,
		}
		const earlyFailure: acquirer.State.FailedAuthorization = {
			authorization: {},
			merchant: "testtest",
			log: [],
			created: isoly.DateTime.now(),
			reason: "bad input",
		}
		expect(acquirer.State.FailedAuthorization.is(earlyFailure)).toBeTruthy()
		const lateFailure: acquirer.State.FailedAuthorization = {
			...acquirer.State.PreAuthorization.from(authorization, merchant, statistics, "verified", {
				EUR: 9.5,
				SEK: 1,
			}),
			log: [],
			created: isoly.DateTime.now(),
			reason: "rejected",
		}
		expect(acquirer.State.FailedAuthorization.is(lateFailure)).toBeTruthy()
	})
})
