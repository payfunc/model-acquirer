import { Verification } from "./index"

describe("Verification", () => {
	const verificationPares: Verification = {
		type: "pares",
		data: {
			amount: 21601,
			cavv: "jI3JBkkaQ1p8CBAAABy0CHUAAAA=",
			cavv_algorithm: "3",
			currency: "DKK",
			eci: "0",
			last4: "1548",
			merchant_id: "02000000000",
			status: "Y",
			xid: "MDAwMDAwMDAwMDEyMzQ1Njc4OTA=",
		},
	}
	const verficationMethod: Verification = {
		type: "method",
		data: {
			authentication: "testtest",
			status: "U",
			reference: {
				server: "threeD",
				directory: "dsTransactionId",
			},
		},
	}
	const verficationChallenge: Verification = {
		type: "challenge",
		data: {
			authentication: "testtest",
			status: "U",
			reference: {
				server: "threeD",
				directory: "dsTransactionId",
			},
		},
	}
	it("Verification.is", () => {
		expect(Verification.is(verificationPares)).toEqual(true)
		expect(Verification.is(verficationMethod)).toEqual(true)
		expect(Verification.is(verficationChallenge)).toEqual(true)
	})
})
