import { Authorization } from "./index"

describe("Authorization tests", () => {
	function createExample(): Omit<Authorization, "status"> {
		return {
			id: "123456789023456",
			merchant: "testtest",
			amount: 101.1,
			currency: "SEK",
			history: [],
			capture: [],
			refund: [],
			created: "2021-04-01T09:00:00.000Z",
			reference: "12341234",
			card: {
				csc: "matched",
				expires: [2, 28],
				iin: "123456",
				last4: "1111",
				scheme: "visa",
				type: "debit",
			},
		}
	}
	it("Authorization status tests", () => {
		const authorization: Omit<Authorization, "status"> = {
			id: "123456789023456",
			merchant: "testtest",
			amount: 101.1,
			currency: "SEK",
			history: [{ amount: 10.33, created: "2021-04-01T10:00:00.000Z" }],
			capture: [{ amount: 11.33, created: "2021-04-02T10:00:00.000Z", status: "approved" }],
			refund: [{ amount: 9.33, created: "2021-04-03T10:00:00.000Z", status: "approved" }],
			created: "2021-04-01T09:00:00.000Z",
			reference: "12341234",
			card: {
				csc: "matched",
				expires: [2, 28],
				iin: "123456",
				last4: "1111",
				scheme: "visa",
				type: "debit",
			},
		}
		expect(Authorization.calculateStatus(authorization).status).toEqual({
			authorized: 100.1,
			captured: 2,
			refunded: 9.33,
		})
	})
	it("Authorization status tests", () => {
		const authorization: Omit<Authorization, "status"> = createExample()
		expect(Authorization.calculateStatus(authorization).status).toEqual({
			authorized: 101.1,
		})
	})
})
