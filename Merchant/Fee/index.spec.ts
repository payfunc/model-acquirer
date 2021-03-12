import * as acquirer from "../../index"

describe("Fee testing", () => {
	const mastercardTransaction: acquirer.Settlement.Transaction = {
		area: "SE",
		authorization: "id",
		card: "credit",
		created: "2021-01-01T12:00:001Z",
		net: 1234.1,
		fee: 0,
		gross: 1234.1,
		reference: "something",
		scheme: "mastercard",
		type: "capture",
	}
	const visaTransaction: acquirer.Settlement.Transaction = { ...mastercardTransaction, scheme: "visa" }
	const feeStructure: acquirer.Merchant.Fee = {
		other: { mastercard: { percentage: 1.23 }, visa: { percentage: 2.215 } },
		capture: 0.1,
	}
	it("Simple fees", () => {
		const mastercardFee = acquirer.Merchant.Fee.apply(mastercardTransaction, feeStructure)
		expect(mastercardFee).toEqual(15.27943)
		const visaFee = acquirer.Merchant.Fee.apply(visaTransaction, feeStructure)
		expect(visaFee).toEqual(27.435315)
	})
})
