import { Statistics } from "./index"

describe("Statistics", () => {
	const records = {
		"2020-02-16": 40,
		"2020-02-17": 30,
		"2020-02-18": 20,
		"2021-02-19": 10,
	}
	it("sum", () => {
		const sum = Statistics.sum(records)
		expect(sum).toEqual(100)
	})
	it("sum between dates", () => {
		const sum = Statistics.sum(records, "2020-02-17", "2020-02-18")
		expect(sum).toEqual(50)
	})
	it("sum between dates 2", () => {
		const sum = Statistics.sum(records, "2019-02-17", "2022-02-18")
		expect(sum).toEqual(100)
	})
	it("sum from date", () => {
		const sum = Statistics.sum(records, "2020-02-18")
		expect(sum).toEqual(30)
	})
})
