import * as model from "@payfunc/model-card"
import { Card } from "./Card"

describe("State.Card tests", () => {
	it("State.Card test if", () => {
		const nonCreatable: model.Card = {
			iin: "411111",
			last4: "1111",
			scheme: "visa",
			expires: [2, 28],
			csc: "matched",
		}
		const card = Card.from(nonCreatable)
		expect(card).toEqual({ csc: "matched", expires: "2028-02-29", iin: "411111", last4: "1111", scheme: "visa" })
		expect(Card.is(card)).toBeTruthy()
	})
	it("State.Card test from creatable", () => {
		const creatable: model.Card.Creatable = {
			pan: "4111111111111111",
			expires: [2, 28],
			csc: "987",
		}
		const card = Card.from(creatable)
		expect(card).toEqual({ csc: "present", expires: "2028-02-29", iin: "411111", last4: "1111", scheme: "visa" })
		expect(Card.is(card)).toBeTruthy()
	})
})
