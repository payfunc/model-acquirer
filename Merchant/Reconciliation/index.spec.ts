import { Fee } from "../Fee/index"
import { Reconciliation } from "./index"

describe("Fee testing", () => {
	const fee: Fee = { other: { mastercard: { percentage: 10 } } }
	const reconciliation: any = {
		account: "testtest",
	}
	it("is", () => {
		expect(Reconciliation.is(reconciliation)).toEqual(false)
		expect(Reconciliation.is({ ...reconciliation, fees: fee })).toEqual(true)
	})
})
