import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import * as acquirer from "../index"

describe("State.PostAuthorization tests", () => {
	it("State.PostAuthorization minimal information test", () => {
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
		const card: model.Card = {
			iin: "411111",
			last4: "1111",
			scheme: "visa",
			expires: [2, 28],
			csc: "matched",
		}
		const authorization: acquirer.Authorization = {
			id: "1234567890123456",
			merchant: "testtest",
			reference: "123412341234",
			amount: 100,
			currency: "EUR",
			descriptor: "test transaction",
			number: "12345678",
			card,
			refund: [],
			capture: [],
			history: [],
			created: "2021-01-01T12:30:30.000Z",
		}
		let postAuthorization: acquirer.State.PostAuthorization = acquirer.State.PostAuthorization.from(
			authorization,
			{ amount: 110 },
			merchant,
			statistics,
			{
				EUR: 9.5,
				SEK: 1,
			}
		)
		const expectedOutput = {
			amount: 1045,
			authorization: {
				amount: 950,
				card: {
					csc: "matched",
					expires: "2028-02-29",
					iin: "411111",
					last4: "1111",
					scheme: "visa",
				},
				created: "2021-01-01T12:30:30.000Z",
				currency: "EUR",
			},
			descriptor: "test transaction",
			merchant: {
				captured: 0,
				country: "SE",
				currency: "SEK",
				descriptor: "Test Merchant",
				fees: 0,
				name: "Test Merchant",
				refundable: 130,
				scheme: [],
				settled: 0,
			},
			now: isoly.Date.now(),
		}
		expect(postAuthorization).toEqual(expectedOutput)
		expect(acquirer.State.PostAuthorization.is(postAuthorization)).toBeTruthy()
		postAuthorization = acquirer.State.PostAuthorization.from(
			{ ...authorization, currency: "GBP" },
			{ amount: 105 },
			{ ...merchant, reconciliation: { ...merchant.reconciliation, currency: "USD" } },
			{ ...statistics, currency: "USD" },
			{ EUR: 5, SEK: 0.2 }
		)
		expect(postAuthorization).toEqual({
			...expectedOutput,
			amount: 105,
			merchant: { ...expectedOutput.merchant, currency: "USD" },
			authorization: { ...expectedOutput.authorization, currency: "GBP", amount: 100 },
		})
		expect(acquirer.State.PostAuthorization.is(postAuthorization)).toBeTruthy()
	})
})
