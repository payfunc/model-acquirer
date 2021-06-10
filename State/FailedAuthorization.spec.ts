import { History } from "../Authorization/History"
import * as acquirer from "../index"

describe("State.FailedAuthorization tests", () => {
	const failedCreate: History.Create = {
		type: "create",
		status: "fail",
		number: "123",
		merchant: "testtest",
		date: "2021-01-05T00:00:01.000Z",
		reason: "3ds problem",
		error: acquirer.Error.unauthorized(),
	}
	const pendingCreate: History.Create = {
		type: "create",
		status: "pending",
		number: "123",
		amount: 1,
		currency: "SEK",
		card: { iin: "411111", last4: "1111", expires: "2022-01-31", scheme: "visa" },
		merchant: "testtest",
		rule: ["Any 3d Rule"],
		reason: "verification required",
		date: "2021-01-01T00:00:01.000Z",
	}
	const failedVerification: History.Verification = {
		type: "verification",
		status: "fail",
		number: "123",
		items: 1,
		currency: "SEK",
		target: "targetURL",
		response: {},
		step: "preauthorization",
		error: acquirer.Error.unauthorized(),
		reason: "unauthorized",
		merchant: "testtest",
		date: "2021-01-02T00:00:01.000Z",
	}
	const pendingVerification: History.Verification = {
		type: "verification",
		status: "pending",
		number: "123",
		items: 1,
		currency: "SEK",
		target: "targetURL",
		response: {},
		step: "authorization",
		merchant: "testtest",
		date: "2021-01-03T00:00:01.000Z",
	}
	const successVerification: History.Verification = {
		type: "verification",
		status: "success",
		number: "123",
		items: 1,
		currency: "SEK",
		target: "targetURL",
		response: {},
		step: "postauthorization",
		merchant: "testtest",
		date: "2021-01-04T00:00:01.000Z",
	}
	const history: History[] = [failedCreate, pendingCreate, failedVerification, pendingVerification, successVerification]
	const expectedOutput: acquirer.State.FailedAuthorization = {
		merchant: { id: "testtest" },
		authorization: {
			amount: 1,
			currency: "SEK",
			card: {
				expires: "2022-01-31",
				iin: "411111",
				last4: "1111",
				scheme: "visa",
			},
			number: "123",
			status: ["failed"],
			reason: "3ds problem",
			created: "2021-01-05T00:00:01.000Z",
			history,
		},
	}
	it("State.FailedAuthorization test", () => {
		const authorization = acquirer.State.FailedAuthorization.from(history)
		expect(acquirer.State.FailedAuthorization.is(authorization)).toBe(true)
		expect(authorization).toEqual(expectedOutput)
	})
})
