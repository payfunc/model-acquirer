import * as isoly from "isoly"
import * as selectively from "selectively"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { Log } from "@payfunc/model-log"
import { Authorization as AcquirerAuthorization } from "../Authorization"
import { Capture } from "../Capture"
import { clear } from "../index"
import { Merchant as AcquirerMerchant } from "../Merchant"
import { Refund } from "../Refund"
import { Transaction as SettlementTransaction } from "../Settlement/Transaction"
import { Statistics } from "../Statistics"
import { Card } from "./Card"
import { Merchant } from "./Merchant"

export interface Authorization {
	merchant: Merchant | { id: authly.Identifier }
	authorization: {
		id: string
		number?: string
		reference: string
		amount: number
		currency: isoly.Currency
		card: Card
		descriptor?: string
		recurring?: AcquirerAuthorization.Recurring
		verification?: "verified" | "unavailable" | "rejected"
		history: AcquirerAuthorization.Change[]
		captured: { history: Capture[]; amount: number; latest?: isoly.DateTime; auto?: true }
		refunded: { history: Refund[]; amount: number; latest?: isoly.DateTime }
		settled: { history: SettlementTransaction[]; gross: number; fee: number; net: number; latest?: isoly.DateTime }
		voided?: isoly.DateTime
		status: AcquirerAuthorization.Status[]
		created: isoly.DateTime
	}
	log: Log[]
}
export namespace Authorization {
	export function is(value: any | Authorization): value is Authorization {
		return (
			typeof value == "object" &&
			(Merchant.is(value.merchant) || (typeof value.merchant == "object" && authly.Identifier.is(value.merchant.id))) &&
			typeof value.authorization == "object" &&
			typeof value.authorization.id == "string" &&
			(value.authorization.number == undefined || typeof value.authorization.number == "string") &&
			typeof value.authorization.reference == "string" &&
			typeof value.authorization.amount == "number" &&
			isoly.Currency.is(value.authorization.currency) &&
			Card.is(value.authorization.card) &&
			(value.authorization.descriptor == undefined || typeof value.authorization.descriptor == "string") &&
			(value.authorization.recurring == undefined ||
				AcquirerAuthorization.Recurring.is(value.authorization.recurring)) &&
			Array.isArray(value.authorization.history) &&
			value.authorization.history.every(AcquirerAuthorization.Change.is) &&
			typeof value.authorization.captured == "object" &&
			value.authorization.captured.history.every(Capture.is) &&
			typeof value.authorization.captured.amount == "number" &&
			(value.authorization.captured.latest == undefined || isoly.DateTime.is(value.authorization.captured.latest)) &&
			(value.authorization.captured.auto == undefined || value.authorization.captured.auto == true) &&
			typeof value.authorization.refunded == "object" &&
			value.authorization.refunded.history.every(Refund.is) &&
			typeof value.authorization.refunded.amount == "number" &&
			(value.authorization.refunded.latest == undefined || isoly.DateTime.is(value.authorization.refunded.latest)) &&
			typeof value.authorization.settled == "object" &&
			value.authorization.settled.history.every(SettlementTransaction.is) &&
			typeof value.authorization.settled.gross == "number" &&
			typeof value.authorization.settled.fee == "number" &&
			typeof value.authorization.settled.net == "number" &&
			(value.authorization.settled.latest == undefined || isoly.Date.is(value.authorization.settled.latest)) &&
			(value.authorization.voided == undefined || isoly.DateTime.is(value.authorization.voided)) &&
			typeof value.authorization.status == "object" &&
			Array.isArray(value.authorization.status) &&
			value.authorization.status.every(AcquirerAuthorization.Status.is) &&
			isoly.DateTime.is(value.authorization.created) &&
			Array.isArray(value.log) &&
			value.log.every(Log.is)
		)
	}
	export function to(state: Authorization): AcquirerAuthorization {
		return AcquirerAuthorization.calculateStatus(
			clear<AcquirerAuthorization>({
				id: state.authorization.id,
				merchant: state.merchant.id,
				number: state.authorization.number,
				reference: state.authorization.reference,
				created: state.authorization.created,
				amount: state.authorization.amount,
				currency: state.authorization.currency,
				card: {
					...state.authorization.card,
					expires: [
						+state.authorization.card.expires.substr(5, 2) as model.Card.Expires.Month,
						+state.authorization.card.expires.substr(2, 2) as model.Card.Expires.Year,
					],
				},
				descriptor: state.authorization.descriptor,
				recurring: state.authorization.recurring,
				history: state.authorization.history,
				capture: state.authorization.captured.history,
				refund: state.authorization.refunded.history,
				void: state.authorization.voided,
				status: {},
			})
		)
	}
	export function from(
		authorization: AcquirerAuthorization,
		merchant: AcquirerMerchant | { id: string },
		log: Log[],
		statistics?: Statistics
	): Authorization {
		const result: Authorization = {
			merchant: statistics && AcquirerMerchant.is(merchant) ? Merchant.from(merchant, statistics) : { id: merchant.id },
			authorization: {
				id: authorization.id,
				amount: authorization.amount,
				currency: authorization.currency,
				card: Card.from(authorization.card),
				created: authorization.created,
				descriptor: authorization.descriptor,
				number: authorization.number,
				reference: authorization.reference,
				history: authorization.history,
				captured: toCaptured(authorization.capture, authorization.currency),
				refunded: toRefunded(authorization.refund, authorization.currency),
				settled: toSettled(authorization),
				voided: authorization.void,
				recurring: authorization.recurring,
				status: Object.entries(authorization.status)
					.map(c => (c[1] ? c[0] : undefined))
					.filter(AcquirerAuthorization.Status.is),
			},
			log,
		}
		if (result.authorization.status.length < 1)
			result.authorization.status.push(authorization.void ? "cancelled" : "authorized")
		return result
	}
	export function toCaptured(
		capture: Capture[],
		currency: isoly.Currency
	): {
		history: Capture[]
		amount: number
		latest?: isoly.DateTime
		auto?: true
	} {
		const result = capture.reduce<{
			history: Capture[]
			amount: number
			latest?: isoly.DateTime
			auto?: true
		}>(
			(r, c) => {
				r.amount += c.amount
				r.latest = !r.latest || r.latest < c.created ? c.created : r.latest
				if (c.auto)
					r.auto = true
				return r
			},
			{ history: capture, amount: 0 }
		)
		result.amount = isoly.Currency.round(result.amount, currency)
		return result
	}
	export function toRefunded(
		refund: Refund[],
		currency: isoly.Currency
	): {
		history: Refund[]
		amount: number
		latest?: isoly.DateTime
	} {
		const result = refund.reduce<{
			history: Refund[]
			amount: number
			latest?: isoly.DateTime
		}>(
			(r, c) => {
				r.amount += c.amount
				r.latest = !r.latest || r.latest < c.created ? c.created : r.latest
				return r
			},
			{ history: refund, amount: 0 }
		)
		result.amount = isoly.Currency.round(result.amount, currency)
		return result
	}
	export function toSettled(
		authorization: AcquirerAuthorization
	): {
		history: SettlementTransaction[]
		gross: number
		fee: number
		net: number
		latest?: isoly.DateTime
	} {
		const result = [...authorization.capture, ...authorization.refund]
			.map(a => a.settlement)
			.filter(SettlementTransaction.is)
			.reduce<{
				history: SettlementTransaction[]
				gross: number
				fee: number
				net: number
				latest?: isoly.DateTime
			}>(
				(r, c) => {
					r.history.push(c)
					r.gross += c.gross
					r.fee += typeof c.fee == "number" ? c.fee : c.fee.total
					r.net += c.net
					r.latest = !r.latest || r.latest < c.created ? c.created : r.latest
					return r
				},
				{ history: [], gross: 0, fee: 0, net: 0 }
			)
		result.gross = isoly.Currency.round(result.gross, authorization.currency)
		result.fee = isoly.Currency.round(result.fee, authorization.currency)
		result.net = isoly.Currency.round(result.net, authorization.currency)
		return result
	}
	export function toCsv(authorizations: Authorization[]): string {
		return AcquirerAuthorization.toCsv(authorizations.map(to))
	}
	export const template = new selectively.Type.Object({
		merchant: Merchant.template,
		authorization: new selectively.Type.Object({
			id: new selectively.Type.String(),
			number: new selectively.Type.String(),
			reference: new selectively.Type.String(),
			amount: new selectively.Type.Number(),
			currency: new selectively.Type.Union(isoly.Currency.types.map(c => new selectively.Type.String(c))),
			card: Card.template,
			descriptor: new selectively.Type.String(),
			recurring: AcquirerAuthorization.Recurring.template,
			verification: new selectively.Type.Union([
				new selectively.Type.String("verified"),
				new selectively.Type.String("unavailable"),
				new selectively.Type.String("rejected"),
			]),
			capture: new selectively.Type.String("auto"),
			captured: new selectively.Type.Object({
				amount: new selectively.Type.Number(),
				latest: new selectively.Type.String(),
				auto: new selectively.Type.String("true"),
			}),
			refunded: new selectively.Type.Object({
				amount: new selectively.Type.Number(),
				latest: new selectively.Type.String(),
			}),
			settled: new selectively.Type.Object({
				gross: new selectively.Type.Number(),
				fee: new selectively.Type.Number(),
				net: new selectively.Type.Number(),
				latest: new selectively.Type.String(),
			}),
			voided: new selectively.Type.String(),
			status: new selectively.Type.Array([
				new selectively.Type.Union([
					new selectively.Type.String("authorized"),
					new selectively.Type.String("cancelled"),
					new selectively.Type.String("captured"),
					new selectively.Type.String("refunded"),
					new selectively.Type.String("settled"),
					new selectively.Type.String("failed"),
				]),
			]),
			reason: new selectively.Type.Array([new selectively.Type.String()]),
			created: new selectively.Type.String(),
		}),
		today: new selectively.Type.String(),
	})
}
