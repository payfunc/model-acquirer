import * as isoly from "isoly"
import { Statistics } from "./Statistics"

describe("Statistics", () => {
	const records = {
		"2020-02-16": 40,
		"2020-02-17": 30,
		"2020-02-18": 20,
		"2021-02-19": 10,
	}
	const decimalNumbers: Record<isoly.Date, number> = {
		"2020-02-16": 0.55555,
		"2020-02-17": 0.33333,
		"2020-02-18": 0.2,
		"2021-02-19": 0.1,
	}
	it("sum", () => {
		const sum = Statistics.sum(records)
		expect(sum).toEqual(100)
	})
	it("sum between dates", () => {
		const sum = Statistics.sum(records, undefined, "2020-02-17", "2020-02-18")
		expect(sum).toEqual(50)
	})
	it("sum between dates 2", () => {
		const sum = Statistics.sum(records, undefined, "2019-02-17", "2022-02-18")
		expect(sum).toEqual(100)
	})
	it("sum from date", () => {
		const sum = Statistics.sum(records, undefined, "2020-02-18")
		expect(sum).toEqual(30)
	})
	it("sum decimals", () => {
		const decimalNumbers: Record<isoly.Date, number> = {
			"2020-02-16": 0.55555,
			"2020-02-17": 0.33333,
			"2020-02-18": 0.2,
			"2021-02-19": 0.1,
		}
		let sum = Statistics.sum(decimalNumbers)
		expect(sum).toEqual(1.1888800000000002)
		sum = Statistics.sum(decimalNumbers, "SEK")
		expect(sum).toEqual(1.19)
	})
	it("summarize Statistics", () => {
		const statistics: Statistics = {
			merchant: "testtest",
			currency: "SEK",
			captured: differentiate(decimalNumbers, 0.1),
			refunded: differentiate(decimalNumbers, 1.5),
			reserves: { in: differentiate(decimalNumbers, 10), out: differentiate(decimalNumbers, 10) },
			settled: differentiate(decimalNumbers, 100),
			fees: differentiate(decimalNumbers, 0.005),
		}
		expect(Statistics.summarize(statistics)).toEqual({
			merchant: "testtest",
			currency: "SEK",
			captured: 0.12,
			refunded: 1.78,
			reserves: 23.78,
			settled: 118.89,
			fees: 0.01,
		})
		expect(Statistics.summarize(statistics, "2020-02-16", "2020-02-17")).toEqual({
			merchant: "testtest",
			currency: "SEK",
			captured: 0.09,
			refunded: 1.33,
			reserves: 17.78,
			settled: 88.89,
			fees: 0,
		})
	})
	it("summarize small record numbers", () => {
		let smallSummary = differentiate(decimalNumbers, 0.005)
		expect(Statistics.sum(smallSummary)).toEqual(0.005944400000000001)
		expect(Statistics.sum(smallSummary, "SEK")).toEqual(0.01)
		smallSummary = differentiate(decimalNumbers, 0.004)
		expect(Statistics.sum(smallSummary)).toEqual(0.004755520000000001)
		expect(Statistics.sum(smallSummary, "SEK")).toEqual(0)
	})
	function differentiate(record: Record<isoly.Date, number>, factor: number): Record<isoly.Date, number> {
		return Object.entries(record).reduce((r, c) => {
			return { ...r, [c[0]]: c[1] * factor }
		}, {})
	}
	it("Test Statistics", () => {
		const statistic: Statistics = {
			captured: {
				"2021-02-23": 56.739999999999995,
				"2021-02-26": 11,
				"2021-03-08": 3.05,
				"2021-03-11": 3.05,
				"2021-03-16": 129,
				"2021-03-31": 5,
				"2021-04-16": 5,
				"2021-04-20": 5,
				"2021-04-23": 0.5,
				"2021-04-26": 1014.8,
				"2021-04-28": 5.3,
				"2021-04-29": 4.6000000000000005,
				"2021-04-30": 4300.69,
				"2021-05-03": 350.08,
				"2021-05-26": 24,
			},
			currency: "EUR",
			fees: {
				"2021-04-26": 0,
			},
			merchant: "testtest",
			refunded: {
				"2021-02-23": 34.74,
				"2021-02-26": 11,
				"2021-03-11": 3.05,
				"2021-04-26": 1014.8,
				"2021-04-28": 4.2,
				"2021-04-29": 2.2,
				"2021-04-30": 1050.24,
				"2021-05-03": 350.08,
				"2021-05-26": 24,
			},
			reserves: {
				in: {
					"2021-04-26": 100,
				},
				out: {
					"2021-06-15": -100,
				},
			},
			settled: {
				"2021-04-26": 500,
			},
		}
		expect(Statistics.is(statistic)).toBe(true)
	})
})
