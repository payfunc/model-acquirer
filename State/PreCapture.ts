import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import { Merchant } from "./Merchant"

export interface PreCapture {
	merchant: Merchant
	amount: number
	currency: isoly.Currency
	card: Omit<model.Card, "expires"> & { expires: isoly.Date }
	authorization: { amount: number; created: isoly.DateTime; capture: number; refund: number; void?: isoly.DateTime }
	now: isoly.Date
	capture?: "auto"
	recurring?: "initial" | "use"
}
