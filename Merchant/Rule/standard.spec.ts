import * as isoly from "isoly"
import * as acquirer from "../../index"

function generatePreAuthorization(): acquirer.State.PreAuthorization {
	return {
		merchant: {
			id: "testtest",
			name: "Example AB",
			descriptor: "Example Company",
			country: "SE",
			currency: "SEK",
			captured: 1000,
			fees: 1000,
			refundable: 1000,
			settled: 1000,
			scheme: ["visa", "mastercard"],
		},
		authorization: {
			amount: 10,
			currency: "SEK",
			card: {
				iin: "411111",
				last4: "1111",
				scheme: "visa",
				expires: isoly.Date.now(),
				csc: "present",
				type: "debit",
			},
			capture: "auto",
			descriptor: "Example AB",
			recurring: "initial",
			verification: "rejected",
		},
		now: isoly.Date.now(),
	}
}
function generatePostAuthorization(): acquirer.State.PostAuthorization {
	return {
		merchant: {
			id: "testtest",
			name: "Example AB",
			descriptor: "Example Company",
			country: "SE",
			currency: "SEK",
			captured: 1000,
			fees: 1000,
			refundable: 1000,
			settled: 1000,
			scheme: ["visa", "mastercard"],
		},
		authorization: {
			amount: 100,
			currency: "SEK",
			card: {
				iin: "411111",
				last4: "1111",
				scheme: "visa",
				expires: isoly.Date.now(),
				csc: "matched",
				type: "debit",
			},
			created: isoly.Date.now(),
		},
		descriptor: "A Descriptor",
		amount: 10,
		now: isoly.Date.now(),
	}
}

describe("Standard Rules", () => {
	it("3D rejection rule", () => {
		const value = generatePreAuthorization()
		const parseable =
			"reject authorization authorization.amount>15 !authorization.verification:verified !authorization.recurring:subsequent"
		const rule = acquirer.Merchant.Rule.parse(parseable)
		expect(rule?.condition.is(value)).toEqual(false) // Passes, below the amount
		value.authorization.amount = 300
		value.authorization.verification = "verified"
		expect(rule?.condition.is(value)).toEqual(false) // Passes, is verified
		value.authorization.amount = 300
		delete value.authorization.verification
		value.authorization.recurring = "subsequent"
		expect(rule?.condition.is(value)).toEqual(false) // Passes, is subsequent
		delete value.authorization.recurring
		expect(rule?.condition.is(value)).toEqual(true) //Rejected, too large amount
	})
	it("Force 3D on initial Recurring", () => {
		const value = generatePreAuthorization()
		const parseable = "reject authorization authorization.recurring:initial !authorization.verification:verified"
		const rule = acquirer.Merchant.Rule.parse(parseable)
		value.authorization.recurring = "initial"
		expect(rule?.condition.is(value)).toEqual(true)
		value.authorization.verification = "verified"
		expect(rule?.condition.is(value)).toEqual(false)
	})
	it("Reject refunds leading to negative refundable", () => {
		const value = generatePostAuthorization()
		const parseable = "reject refund merchant.refundable<0"
		const rule = acquirer.Merchant.Rule.parse(parseable)
		expect(rule?.condition.is(value)).toEqual(false)
		value.merchant.refundable = -10
		expect(rule?.condition.is(value)).toEqual(true)
	})
	it("Force csc present", () => {
		const value = generatePreAuthorization()
		const parseable = "reject authorization !authorization.recurring:subsequent !authorization.card.csc:present"
		const rule = acquirer.Merchant.Rule.parse(parseable)
		expect(rule?.condition.is(value)).toEqual(false)
		delete value.authorization.card.csc
		expect(rule?.condition.is(value)).toEqual(true)
		value.authorization.recurring = "subsequent"
		expect(rule?.condition.is(value)).toEqual(false)
	})
	/* Following are not implemented Rules yet */
	it.skip("Reject capturing more than 1.05 times the authorized amount", () => {
		const value = generatePostAuthorization()
		const parseable = "reject capture amount>(authorization.amount*1.05 - authorization.captured.amount)"
		const rule = acquirer.Merchant.Rule.parse(parseable)
		expect(rule?.condition.is(value)).toEqual(false)
		value.amount = 1000
		expect(rule?.condition.is(value)).toEqual(true)
	})
	it.skip("Force descriptor", () => {
		const value = generatePreAuthorization()
		const parseable = "reject authorization !authorization.descriptor: (*merchant.descriptor* | *merchant.name*)"
		const rule = acquirer.Merchant.Rule.parse(parseable)
		expect(rule?.condition.is(value)).toEqual(false)
		value.authorization.descriptor = "Different Name"
		expect(rule?.condition.is(value)).toEqual(true)
	})
	it.skip("Enforce schemes", () => {
		const value = generatePreAuthorization()
		const parseable = "reject authorization !authorization.card.scheme:some(merchant.scheme)"
		const rule = acquirer.Merchant.Rule.parse(parseable)
		expect(rule?.condition.is(value)).toEqual(false)
		value.authorization.card.scheme = "maestro"
		expect(rule?.condition.is(value)).toEqual(true)
	})
})
