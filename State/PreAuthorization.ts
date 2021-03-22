import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import { Merchant } from "./Merchant"

export interface PreAuthorization {
	merchant: Merchant
	authorization: {
		amount: number
		currency: isoly.Currency
		card: Omit<model.Card, "expires"> & { expires: isoly.Date; csc?: "present" }
		capture?: "auto"
		verification?: "verified" | "unavailable" | "rejected"
		recurring?: "initial" | "subsequent"
	}
	now: isoly.Date
}
