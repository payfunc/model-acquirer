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
			currency: "SEK",
			reconciliation: { account: "exampleAccount", fees: { other: {} } },
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
			reserves: { in: {}, out: {} },
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
			category: "withdrawal",
		})
		let state = Authorization.from(authorization, merchant)
		expect(Authorization.is(state)).toBeTruthy()
		state = Authorization.from(authorization, merchant, statistics)
		expect(Authorization.is(state)).toBeTruthy()
		const csv = Authorization.toCsv([
			state,
			Authorization.from(
				{ ...authorization, capture: [{ amount: 100, created: "2021-01-02T12:30:30.000Z", status: "approved" }] },
				merchant
			),
		])
		expect(csv).toEqual(
			"id,merchant,number,reference,created,category,amount,currency,card type,card scheme,card,card expires,descriptor,recurring,change,capture,refund,void,status\r\n" +
				'"1234567890123456","testtest","12345678","123412341234","2021-01-01T12:30:30.000Z","withdrawal","100","EUR","unknown","visa","411111**********1111","02/2028","test transaction","","0","0","0","","authorized"\r\n' +
				'"1234567890123456","testtest","12345678","123412341234","2021-01-01T12:30:30.000Z","withdrawal","100","EUR","unknown","visa","411111**********1111","02/2028","test transaction","","0","100","0","","captured"\r\n'
		)
	})
})
