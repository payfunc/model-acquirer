import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import * as acquirer from "../index"

describe("State.PreAuthorization tests", () => {
	it("State.PreAuthorization test", () => {
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
		let preAuthorization: acquirer.State.PreAuthorization = acquirer.State.PreAuthorization.from(
			authorization,
			merchant,
			statistics,
			"verified",
			{
				EUR: 9.5,
				SEK: 1,
			}
		)
		const expectedOutput: acquirer.State.PreAuthorization = {
			authorization: {
				amount: 100,
				card: {
					csc: "present",
					expires: "2028-02-29",
					iin: "411111",
					last4: "1111",
					scheme: "visa",
				},
				currency: "SEK",
				descriptor: "test transaction",
				number: "12345678",
				verification: "verified",
			},
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
		expect(preAuthorization).toEqual(expectedOutput)
		expect(acquirer.State.PreAuthorization.is(preAuthorization)).toBeTruthy()
		preAuthorization = acquirer.State.PreAuthorization.from(authorization, merchant, statistics, "verified", {
			EUR: 9.5,
			SEK: 8.8,
		})
		expect(preAuthorization).toEqual(expectedOutput)
		expect(acquirer.State.PreAuthorization.is(preAuthorization)).toBeTruthy()
		preAuthorization = acquirer.State.PreAuthorization.from(
			authorization,
			{ ...merchant, reconciliation: { ...merchant.reconciliation, currency: "EUR" } },
			{ ...statistics, currency: "EUR" },
			"verified",
			{ EUR: 1, SEK: 0.1 }
		)
		expect(preAuthorization).toEqual({
			...expectedOutput,
			merchant: { ...expectedOutput.merchant, currency: "EUR" },
			authorization: { ...expectedOutput.authorization, amount: 10 },
		})
		expect(acquirer.State.PreAuthorization.is(preAuthorization)).toBeTruthy()
	})
})
