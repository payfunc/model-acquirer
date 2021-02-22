import * as isoly from "isoly"
import * as authly from "authly"

export interface Statistics {
	merchant: authly.Identifier
	currency: isoly.Currency
	captured: Record<isoly.Date, number>
	settled: Record<isoly.Date, number>
	fees: Record<isoly.Date, number>
	refundable: number
}
