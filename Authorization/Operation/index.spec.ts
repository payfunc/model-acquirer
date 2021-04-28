import * as gracely from "gracely"
import * as isoly from "isoly"
import * as acquirer from "../../index"

describe("Operation tests", () => {
	it("Operation Capture test", () => {
		const capture: acquirer.Authorization.Operation.Capture = {
			type: "capture",
			capture: { created: isoly.DateTime.now(), amount: 100, status: "approved" },
		}
		expect(acquirer.Authorization.Operation.Capture.is(capture)).toBeTruthy()
		capture.number = "1234abcd"
		expect(acquirer.Authorization.Operation.Capture.is(capture)).toBeTruthy()
		capture.capture = gracely.server.backendFailure("example error")
		expect(acquirer.Authorization.Operation.Capture.is(capture)).toBeTruthy()
		expect(acquirer.Authorization.Operation.is(capture)).toBeFalsy()
		expect(acquirer.Authorization.Operation.is({ "1234abcd1234": capture })).toBeFalsy()
		expect(acquirer.Authorization.Operation.is({ "1234abcd1234ab": capture })).toBeFalsy()
		expect(acquirer.Authorization.Operation.is({ "1234abcd1234abcd": capture })).toBeTruthy()
		const example1 = {
			"1234abcd1234abcd": {
				type: "capture",
				number: "123abc",
				capture: {
					created: isoly.DateTime.now(),
					amount: 100,
					status: "approved",
				},
			},
			"1234abcd12340000": {
				type: "capture",
				number: "123abc",
				capture: {
					status: 400,
					type: "invalid input",
					details: {
						description: "",
					},
				},
			},
		}
		const example2 = {
			"1234abcd1234abcd": {
				created: isoly.DateTime.now(),
				amount: 100,
				status: "approved",
			},
			"1234abcd12340000": {
				status: 400,
				type: "invalid input",
				details: {
					description: "",
				},
			},
		}
	})
})
