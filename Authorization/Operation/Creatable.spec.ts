import * as acquirer from "../../index"

describe("Operation.Creatable tests", () => {
	it("Operation Capture.Creatable test", () => {
		const capture: acquirer.Authorization.Operation.Capture.Creatable = {
			type: "capture",
			capture: { amount: 100 },
		}
		expect(acquirer.Authorization.Operation.Capture.Creatable.is(capture)).toBeTruthy()
		expect(acquirer.Authorization.Operation.Creatable.is(capture)).toBeFalsy()
		expect(acquirer.Authorization.Operation.Creatable.is({ "1234abcd1234": capture })).toBeFalsy()
		expect(acquirer.Authorization.Operation.Creatable.is({ "1234abcd1234ab": capture })).toBeFalsy()
		expect(acquirer.Authorization.Operation.Creatable.is({ "1234abcd1234abcd": capture })).toBeTruthy()
	})
})
