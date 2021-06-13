import * as isoly from "isoly"
export interface Settlement {
	merchant: string
	number: string
	date: isoly.DateTime
	type: "settlement"
	status: "success"
	operation: string
	reference: string
	payout: isoly.Date
}

export namespace Settlement {
	export function is(value: any | Settlement): value is Settlement {
		return (
			typeof value == "object" &&
			typeof value.merchant == "string" &&
			typeof value.number == "string" &&
			isoly.DateTime.is(value.date) &&
			value.type == "settlement" &&
			value.status == "settlement" &&
			typeof value.operation == "string" &&
			typeof value.reference == "string" &&
			isoly.Date.is(value.payout)
		)
	}
}
