import { Authorization } from "../Authorization"
import { Settlement } from "./index"
import { Transaction } from "./Transaction"

describe("Settlement", () => {
	const transaction: Transaction = {
		authorization: "12345",
		reference: "234242",
		type: "authorization",
		card: "debit",
		scheme: "mastercard",
		area: "SE",
		created: "2020-02-16",
		currency: "SEK",
		gross: 2,
		fee: 3,
		net: 12,
	}
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
			currency: "EUR",
			gross: 2,
			fee: { scheme: 2, total: 3 },
			net: 4,
			transactions: [transaction],
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
	const authorization: Authorization[] = [
		{
			id: "12343213215",
			number: "testNumber",
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
			status: { captured: 1 },
		},
	]
	it("Transaction.is", () => {
		expect(Transaction.is(transaction)).toEqual(true)
	})

	it("toDetailedCsv", () => {
		expect(Settlement.toDetailedCsv(settlement, authorization)).toEqual(
			`merchant,settlement reference,operation,posting date,authorization id,authorization number,card IIN,card type,card scheme,scheme reference,issuer country,currency,payout date,payout amount,reserve release,reserve amount,gross,fee,interchange,net\r\n"SQJzzNur","example","authorization","2020-02-16","12345","","","debit","mastercard","234242","SE","SEK","2020-03-02","12","","0","2","3","0","12"\r\n`
		)
	})
	it("toCsv", () => {
		const csv = Settlement.toCsv(settlement)
		expect(csv).toEqual(
			"reference,merchant,start,end,payout date,payout amount,reserve release,reserve amount,created,gross,fee,interchange,net,currency,transactions\r\n" +
				'"example","SQJzzNur","2020-02-01","2020-02-07","2020-03-02","4","","0","2020-01-16","2","3","2","4","EUR","1"\r\n'
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
					currency: "SEK",
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
	it("Settlement flaw", () => {
		const settle = { ...settlement[0], period: { start: "2021-01-01" }, fee: undefined }
		expect(Settlement.flaw(settle)).toEqual({
			type: "Settlement",
			flaws: [
				{
					property: "period",
					type: "{start: isoly.Date, end: isoly.Date}",
				},
				{
					property: "fee",
					type: "number | { scheme: number; total: number }",
				},
			],
		})
	})
	it("Transaction flaw", () => {
		expect(Transaction.flaw(transaction)).toEqual({ type: "Transaction", flaws: [] })
		expect(Transaction.flaw({ ...transaction, fee: undefined })).toEqual({
			type: "Transaction",
			flaws: [{ property: "fee", type: "number | { scheme: number; total: number }" }],
		})
	})
})
