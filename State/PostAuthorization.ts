import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import { Merchant } from "./Merchant"

export interface PostAuthorization {
	merchant: Merchant
	amount: number
	currency: isoly.Currency
	card: Omit<model.Card, "expires"> & { expires: isoly.Date; csc?: "matched" | "mismatched" }
	authorization: {
		amount: number
		created: isoly.DateTime
		captured?: { amount: number; latest: isoly.DateTime }
		refunded?: { amount: number; latest: isoly.DateTime }
		voided?: isoly.DateTime
		recurring?: "initial" | "subsequent"
		capture?: "auto"
	}
	now: isoly.Date
}
