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
		authorization = Authorization.calculateStatus(authorization)
		const onlyAuthorized = Authorization.calculateStatus(createExample())
		const header = `id,merchant,number,reference,created,amount,currency,card type,card scheme,card,card expires,descriptor,recurring,history,capture,refund,void,status\r\n`
		const data = [
			`123456789023456,testtest,,12341234,2021-04-01T09:00:00.000Z,101.1,SEK,debit,visa,123456**********1111,02/2028,,false,20.66,22.66,18.66,not voided,authorized captured refunded settled\r\n`,
			`123456789023456,testtest,,12341234,2021-04-01T09:00:00.000Z,101.1,SEK,debit,visa,123456**********1111,02/2028,,false,0,0,0,not voided,authorized\r\n`,
		]
		const details =
			`change number,created,amount\r\n` +
			`,2021-04-01T10:00:00.000Z,10.33\r\n` +
			`,2021-04-05T10:00:00.000Z,10.33\r\n` +
			`capture number,created,reference,approved,amount,auto capture,settlement,descriptor,status\r\n` +
			`,2021-04-02T10:00:00.000Z,1234567891001,2021-04-02T10:00:00.000Z,11.33,false,234242,,settled\r\n` +
			`,2021-04-06T10:00:00.000Z,1234567891002,false,11.33,false,not settled,,pending\r\n` +
			`refund number,created,reference,approved,amount,settlement,descriptor,status\r\n` +
			`,2021-04-03T10:00:00.000Z,1234567891011,2021-04-03T10:00:00.000Z,9.33,not settled,,approved\r\n` +
			`,2021-04-07T10:00:00.000Z,1234567891012,false,9.33,not settled,,pending\r\n`
		expect(Authorization.toCsv([authorization, onlyAuthorized])).toEqual(header + data[0] + data[1])
		expect(Authorization.toCsv([authorization, onlyAuthorized], true)).toEqual(header + data[0] + details + data[1])
		expect(Authorization.toCsv([authorization])).toEqual(header + data[0])
		expect(Authorization.toCsv([authorization], true)).toEqual(header + data[0] + details)
		expect(Authorization.toCsv(authorization)).toEqual(header + data[0] + details)
		expect(Authorization.toCsv(authorization, false)).toEqual(header + data[0])
		expect(Authorization.toCsv(authorization, true)).toEqual(header + data[0] + details)
	})
})
