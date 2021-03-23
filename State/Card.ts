import * as isoly from "isoly"
import * as model from "@payfunc/model-card"

export type Card = Omit<model.Card, "expires"> & { expires: isoly.Date }
export namespace Card {
	export function is(value: any | Card): value is Card {
		return (
			typeof value == "object" &&
			model.Card.Scheme.is(value.scheme) &&
			typeof value.iin == "string" &&
			value.iin.length == 6 &&
			typeof value.last4 == "string" &&
			value.last4.length == 4 &&
			isoly.Date.is(value.expires) &&
			(value.type == undefined || model.Card.Type.is(value.type)) &&
			(value.csc == undefined || ["matched", "mismatched", "present"].includes(value.csc))
		)
	}
	export function from(card: model.Card.Creatable): Card & { csc?: "present" }
	export function from(card: model.Card): Card
	export function from(card: model.Card.Creatable | model.Card): Card {
		return {
			...(model.Card.is(card) ? card : model.Card.from(card)),
			expires:
				(2000 + card.expires[1]).toString() +
				"-" +
				card.expires[0].toString().padStart(2, "0") +
				"-" +
				lastDayOfMonth(2000 + card.expires[1], card.expires[0]),
		}
	}
	function lastDayOfMonth(year: number, month: number): "28" | "29" | "30" | "31" {
		let result: "28" | "29" | "30" | "31"
		switch (month) {
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
			default:
				result = "31"
				break
			case 4:
			case 6:
			case 9:
			case 11:
				result = "30"
				break
			case 2:
				result = year % 4 == 0 ? "29" : "28"
				break
		}
		return result
	}
}
