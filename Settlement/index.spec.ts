import { Settlement } from "./index"

describe("Settlement", () => {
	const settlement: Settlement[] = [
		{
			reference: "example",
			merchant: "SQJzzNur",
			period: {
				start: "2020-02-01",
				end: "2020-02-07",
			},
			payout: "2020-03-02",
			created: "2020-01-16",
			gross: 2,
			fee: { scheme: 2, total: 3 },
			net: 4,
			currency: "EUR",
			transactions: [
				{
					authorization: "12345",
					reference: "234242",
					type: "authorization",
					card: "debit",
					scheme: "mastercard",
					area: "SE",
					created: "2020-02-16",
					gross: 2,
					fee: 3,
					net: 12,
				},
			],
		},
	]
	const withoutTransactions: Settlement[] = [
		{
			reference: "example",
			merchant: "SQJzzNur",
			period: {
				start: "2020-02-01",
				end: "2020-02-07",
			},
			payout: "2020-03-02",
			created: "2020-01-16",
			gross: 2,
			fee: 3,
			net: 4,
			currency: "EUR",
			transactions: [],
		},
	]
	const multiple: Settlement[] = [
		{
			reference: "example1",
			merchant: "SQJzzNur",
			period: {
				start: "2020-02-01",
				end: "2020-02-07",
			},
			payout: "2020-03-02",
			created: "2020-01-16",
			gross: 2,
			fee: { scheme: 2, total: 3 },
			net: 4,
			currency: "EUR",
			transactions: [],
		},
		{
			reference: "example2",
			merchant: "SQJzzNur",
			period: {
				start: "2020-02-01",
				end: "2020-02-07",
			},
			payout: "2020-03-02",
			created: "2020-01-16",
			gross: 2,
			fee: { scheme: 2, total: 6 },
			net: 4,
			currency: "EUR",
			transactions: [],
		},
		{
			reference: "example3",
			merchant: "SQJzzNur",
			period: {
				start: "2020-02-01",
				end: "2020-02-07",
			},
			payout: "2020-03-02",
			created: "2020-01-16",
			gross: 2,
			fee: 3,
			net: 4,
			currency: "EUR",
			transactions: [],
		},
		{
			reference: "noPayout",
			merchant: "SQJzzNur",
			period: {
				start: "2020-02-01",
				end: "2020-02-07",
			},
			created: "2020-01-16",
			gross: 2,
			fee: 3,
			net: 4,
			currency: "EUR",
			transactions: [],
		},
	]
	it("toCsv", () => {
		const csv = Settlement.toCsv(settlement)
		expect(csv).toEqual(
			"reference,merchant,start date,end date,payout date,reserve amount,reserve payout,created,gross,fee,net,currency\r\n" +
				'"example","SQJzzNur","2020-02-01","2020-02-07","2020-03-02","undefined","undefined","2020-01-16","2","3","4","EUR"\r\n' +
				"authorization,reference,type,card,scheme,area,created,gross,fee,net,reserve amount,reserve payout\r\n" +
				'"12345","234242","authorization","debit","mastercard","SE","2020-02-16","2","3","12","undefined","undefined"\r\n'
		)
	})
	it("toCsv without transactions", () => {
		const csv = Settlement.toCsv(withoutTransactions)
		expect(csv).toEqual(
			"reference,merchant,start date,end date,payout date,reserve amount,reserve payout,created,gross,fee,net,currency\r\n" +
				'"example","SQJzzNur","2020-02-01","2020-02-07","2020-03-02","undefined","undefined","2020-01-16","2","3","4","EUR"\r\n'
		)
	})
	it("toCsv with multiple settlements", () => {
		const csv = Settlement.toCsv(multiple)
		expect(csv).toEqual(
			"reference,merchant,start date,end date,payout date,reserve amount,reserve payout,created,gross,fee,net,currency\r\n" +
				'"example1","SQJzzNur","2020-02-01","2020-02-07","2020-03-02","undefined","undefined","2020-01-16","2","3","4","EUR"\r\n' +
				'"example2","SQJzzNur","2020-02-01","2020-02-07","2020-03-02","undefined","undefined","2020-01-16","2","6","4","EUR"\r\n' +
				'"example3","SQJzzNur","2020-02-01","2020-02-07","2020-03-02","undefined","undefined","2020-01-16","2","3","4","EUR"\r\n' +
				'"noPayout","SQJzzNur","2020-02-01","2020-02-07","undefined","undefined","undefined","2020-01-16","2","3","4","EUR"\r\n'
		)
	})
	it("toCustomer", () => {
		const result = Settlement.toCustomer(settlement[0])
		expect(result).toEqual({
			reference: "example",
			merchant: "SQJzzNur",
			period: {
				start: "2020-02-01",
				end: "2020-02-07",
			},
			payout: "2020-03-02",
			created: "2020-01-16",
			gross: 2,
			fee: 3,
			net: 4,
			currency: "EUR",
			transactions: [
				{
					authorization: "12345",
					reference: "234242",
					type: "authorization",
					card: "debit",
					scheme: "mastercard",
					area: "SE",
					created: "2020-02-16",
					gross: 2,
					fee: 3,
					net: 12,
				},
			],
		})
	})
	it("toCustomer with multiple settlements", () => {
		const result = Settlement.toCustomer(multiple)
		expect(result).toEqual([
			{
				reference: "example1",
				merchant: "SQJzzNur",
				period: {
					start: "2020-02-01",
					end: "2020-02-07",
				},
				payout: "2020-03-02",
				created: "2020-01-16",
				gross: 2,
				fee: 3,
				net: 4,
				currency: "EUR",
				transactions: [],
			},
			{
				reference: "example2",
				merchant: "SQJzzNur",
				period: {
					start: "2020-02-01",
					end: "2020-02-07",
				},
				payout: "2020-03-02",
				created: "2020-01-16",
				gross: 2,
				fee: 6,
				net: 4,
				currency: "EUR",
				transactions: [],
			},
			{
				reference: "example3",
				merchant: "SQJzzNur",
				period: {
					start: "2020-02-01",
					end: "2020-02-07",
				},
				payout: "2020-03-02",
				created: "2020-01-16",
				gross: 2,
				fee: 3,
				net: 4,
				currency: "EUR",
				transactions: [],
			},
			{
				reference: "noPayout",
				merchant: "SQJzzNur",
				period: {
					start: "2020-02-01",
					end: "2020-02-07",
				},
				created: "2020-01-16",
				gross: 2,
				fee: 3,
				net: 4,
				currency: "EUR",
				transactions: [],
			},
		])
	})
})
