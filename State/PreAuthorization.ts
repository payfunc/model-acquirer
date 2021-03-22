import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import { Merchant } from "./Merchant"

export interface PreAuthorization {
	merchant: Merchant
	amount: number
	currency: isoly.Currency
	card: Omit<model.Card, "expires"> & { expires: isoly.Date }
	now: isoly.Date
	capture?: "auto"
	verification?: "verified" | "noServiceAvailable" | "rejected"
	cscPresent: boolean
	recurring?: "initial" | "use"
}

// "reject authorization amount > 150 !verification:verified !recurring:use"
// "reject authorization recurring:initial !verification:verified"
// "reject authorization merchant.captured[for xx days] > 30000"
