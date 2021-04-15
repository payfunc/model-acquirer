import { Authorization } from "./index"

describe("Authorization tests", () => {
	function createExample(): Omit<Authorization, "status"> {
		return {
			id: "1234567890123456",
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
		const authorization = createExample()
		authorization.history.push({ amount: 10.33, created: "2021-04-01T10:00:00.000Z" })
		authorization.capture.push({
			reference: "1234567891020",
			amount: 11.33,
			created: "2021-04-02T10:00:00.000Z",
			status: "approved",
		})
		authorization.refund.push({
			reference: "1234567891021",
			amount: 9.33,
			created: "2021-04-03T10:00:00.000Z",
			status: "approved",
		})
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
	it("Authorization toCsv test", () => {
		let authorization: Authorization = Authorization.calculateStatus(createExample())
		authorization.history.push({ amount: 10.33, created: "2021-04-01T10:00:00.000Z" })
		authorization.capture.push({
			reference: "1234567891001",
			amount: 11.33,
			created: "2021-04-02T10:00:00.000Z",
			approved: "2021-04-02T10:00:00.000Z",
			status: "settled",
			settlement: {
				authorization: "12345",
				reference: "234242",
				type: "authorization",
				card: "debit",
				scheme: "visa",
				area: "SE",
				created: "2021-04-03",
				gross: 11.33,
				fee: 0.11,
				net: 11.22,
			},
		})
		authorization.refund.push({
			reference: "1234567891011",
			amount: 9.33,
			created: "2021-04-03T10:00:00.000Z",
			approved: "2021-04-03T10:00:00.000Z",
			status: "approved",
		})
		authorization.history.push({ amount: 10.33, created: "2021-04-05T10:00:00.000Z" })
		authorization.capture.push({
			reference: "1234567891002",
			amount: 11.33,
			created: "2021-04-06T10:00:00.000Z",
			status: "pending",
		})
		authorization.refund.push({
			reference: "1234567891012",
			amount: 9.33,
			created: "2021-04-07T10:00:00.000Z",
			status: "pending",
		})
		authorization = Authorization.calculateStatus({ ...authorization, id: "1234123412341234" })
		const authorized = Authorization.calculateStatus(createExample())
		let captured = Authorization.calculateStatus({ ...createExample(), id: "1234000012340000" })
		captured.capture.push({
			reference: "1234567891003",
			amount: 101.1,
			created: "2021-04-06T10:00:00.000Z",
			approved: "2021-04-06T10:00:00.000Z",
			status: "approved",
		})
		captured = Authorization.calculateStatus(captured)
		let voided = Authorization.calculateStatus({
			...createExample(),
			id: "1234000012340001",
			amount: 40.4,
			currency: "EUR",
		})
		voided.void = "2021-04-06T12:00:00.000Z"
		voided = Authorization.calculateStatus(voided)
		const header = `id,merchant,number,reference,created,amount,currency,card type,card scheme,card,card expires,descriptor,recurring,history,capture,refund,void,status\r\n`
		const data = [
			`1234123412341234,testtest,,12341234,2021-04-01T09:00:00.000Z,101.1,SEK,debit,visa,123456**********1111,02/2028,,,20.66,22.66,18.66,,authorized captured refunded settled\r\n`,
			`1234567890123456,testtest,,12341234,2021-04-01T09:00:00.000Z,101.1,SEK,debit,visa,123456**********1111,02/2028,,,0,0,0,,authorized\r\n`,
			`1234000012340000,testtest,,12341234,2021-04-01T09:00:00.000Z,101.1,SEK,debit,visa,123456**********1111,02/2028,,,0,101.1,0,,captured\r\n`,
			`1234000012340001,testtest,,12341234,2021-04-01T09:00:00.000Z,40.4,EUR,debit,visa,123456**********1111,02/2028,,,0,0,0,2021-04-06T12:00:00.000Z,cancelled\r\n`,
		]
		expect(Authorization.toCsv([authorization])).toEqual(header + data[0])
		expect(Authorization.toCsv([authorization, authorized])).toEqual(header + data[0] + data[1])
		expect(Authorization.toCsv([authorization, authorized, captured])).toEqual(header + data[0] + data[1] + data[2])
		expect(Authorization.toCsv([authorization, authorized, captured, voided])).toEqual(
			header + data[0] + data[1] + data[2] + data[3]
		)
	})
})
