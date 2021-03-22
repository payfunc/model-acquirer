import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import { Merchant } from "./Merchant"

export interface PreRefund {
	merchant: Merchant
	amount: number
	currency: isoly.Currency
	card: Omit<model.Card, "expires"> & { expires: isoly.Date }
	authorization: {
		amount: number
		created: isoly.DateTime
		capture?: { amount: number; latest: isoly.DateTime }
		refund?: { amount: number; latest: isoly.DateTime }
		void?: isoly.DateTime
	}
	now: isoly.Date
	capture?: "auto"
	recurring?: "initial" | "use"
}
