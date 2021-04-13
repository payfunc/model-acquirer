import * as isoly from "isoly"
import { Statistics } from "./index"

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
	const statistics: Statistics = {
		merchant: "testtest",
		currency: "SEK",
		captured: {
			"2020-02-16": 40.1,
			"2020-02-17": 30.1,
			"2020-02-18": 20.1,
			"2020-02-22": 10.1,
		},
		refunded: {
			"2020-02-17": 5,
			"2020-02-19": 20.1,
		},
		settled: {
			"2020-02-17": 25.1,
			"2020-02-18": 17.1,
			"2020-02-19": 13.1,
			"2020-02-20": -20.1,
			"2020-02-23": 6.8,
		},
		reserves: {
			"2020-02-17": 15,
			"2020-02-18": 8,
			"2020-02-19": 7,
			"2020-02-23": 3.3,
			"2020-05-17": -15,
			"2020-05-18": -8,
			"2020-05-19": -7,
			"2020-05-23": -3.3,
		},
		fees: {
			"2020-02-16": 0,
			"2020-02-17": 0,
			"2020-02-18": 0,
			"2020-02-19": 0,
		},
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
	it("refundable Statistics", () => {
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-05-23")).toEqual(75.3)
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-02-23")).toEqual(75.3)
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-02-16")).toEqual(40.1)
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-02-17")).toEqual(65.2)
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-02-18")).toEqual(0)
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-02-19")).toEqual(0)
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-02-22")).toEqual(0)
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-02-22")).toEqual(0)
		expect(Statistics.refundable(statistics, "2020-02-16", "2020-02-24")).toEqual(0)
		// expect(Statistics.summarize(statistics)).toEqual({
		// 	merchant: "testtest",
		// 	currency: "SEK",
		// 	captured: 0.12,
		// 	refunded: 1.78,
		// 	reserves: 11.89,
		// 	settled: 118.89,
		// 	fees: 0.01,
		// })
	})
	it("summarize Statistics", () => {
		const statistics: Statistics = {
			merchant: "testtest",
			currency: "SEK",
			captured: differentiate(decimalNumbers, 0.1),
			refunded: differentiate(decimalNumbers, 1.5),
			reserves: differentiate(decimalNumbers, 10),
			settled: differentiate(decimalNumbers, 100),
			fees: differentiate(decimalNumbers, 0.005),
		}
		expect(Statistics.summarize(statistics)).toEqual({
			merchant: "testtest",
			currency: "SEK",
			captured: 0.12,
			refunded: 1.78,
			reserves: 11.89,
			settled: 118.89,
			fees: 0.01,
		})
		expect(Statistics.summarize(statistics, "2020-02-16", "2020-02-17")).toEqual({
			merchant: "testtest",
			currency: "SEK",
			captured: 0.09,
			refunded: 1.33,
			reserves: 8.89,
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
})
