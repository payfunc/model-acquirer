import * as model from "@payfunc/model-card"
import * as acquirer from "../index"
import { Authorization } from "./Authorization"

describe("State.Authorization", () => {
	it("Parse State Authoriztion", () => {
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
			refunded: {},
			settled: {},
			fees: {},
			reserves: {},
		}
		const card: model.Card = {
			iin: "411111",
			last4: "1111",
			scheme: "visa",
			expires: [2, 28],
			csc: "matched",
		}
		const authorization: acquirer.Authorization = acquirer.Authorization.calculateStatus({
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
		})

		expect(Authorization.is(Authorization.from(authorization, merchant))).toBeTruthy()
		expect(Authorization.is(Authorization.from(authorization, merchant, statistics))).toBeTruthy()
	})
})
