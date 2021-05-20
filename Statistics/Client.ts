import * as gracely from "gracely"
import * as isoly from "isoly"
import { Authorization } from "../Authorization"
import { Settlement } from "../Settlement"
import { Statistics } from "./Statistics"

export interface Operations {
	merchant: string
	capture: (amount: number, currency: isoly.Currency) => Promise<Statistics | gracely.Error>
	get: (currency: isoly.Currency, rate: Record<string, number>) => Promise<Statistics | gracely.Error>
	rebuild: (
		authorizations: Authorization[],
		settlements: Settlement[],
		rate: Record<string, number>
	) => Promise<Statistics[] | gracely.Error>
	refund: (amount: number, currency: isoly.Currency) => Promise<Statistics | gracely.Error>
	settle: (settlement: Settlement, date: isoly.Date) => Promise<Statistics | gracely.Error>
}

export class Client {
	private constructor(readonly connection: DurableObjectNamespace) {}
	load(merchant: string): Operations {
		const stub = this.connection.get(this.connection.idFromName(merchant))
		return {
			merchant,
			capture: async (amount, currency) => await capture(amount, currency, stub),
			get: async (currency, rate) => await get(currency, rate, stub),
			settle: async (settlement, date) => await settle(settlement, date, stub),
			refund: async (amount, currency) => await refund(amount, currency, stub),
			rebuild: async (authorizations, settlements, rate) => await rebuild(authorizations, settlements, rate, stub),
		}
	}
	static open(connection: DurableObjectNamespace): Client {
		return new Client(connection)
	}
}

async function capture(
	amount: number,
	currency: isoly.Currency,
	stub: DurableObjectStub
): Promise<Statistics | gracely.Error> {
	return await stub.fetch("capture", { body: JSON.stringify({ amount, currency }) }).then(
		r => r.json(),
		e => gracely.server.unknown(e.message)
	)
}
async function get(
	currency: isoly.Currency,
	rate: Record<string, number>,
	stub: DurableObjectStub
): Promise<Statistics | gracely.Error> {
	return await stub.fetch("get", { body: JSON.stringify({ currency, rate }) }).then(
		r => r.json(),
		e => gracely.server.unknown(e.message)
	)
}
async function settle(
	settlement: Settlement,
	date: isoly.Date,
	stub: DurableObjectStub
): Promise<Statistics | gracely.Error> {
	return await stub.fetch("settle", { body: JSON.stringify({ settlement, date }) }).then(
		r => r.json(),
		e => gracely.server.unknown(e.message)
	)
}
async function refund(
	amount: number,
	currency: isoly.Currency,
	stub: DurableObjectStub
): Promise<Statistics | gracely.Error> {
	return await stub.fetch("refund", { body: JSON.stringify({ amount, currency }) }).then(
		r => r.json(),
		e => gracely.server.unknown(e.message)
	)
}
async function rebuild(
	authorizations: Authorization[],
	settlements: Settlement[],
	rate: Record<string, number>,
	stub: DurableObjectStub
): Promise<Statistics[] | gracely.Error> {
	return await stub.fetch("rebuild", { body: JSON.stringify({ authorizations, settlements, rate }) }).then(
		r => r.json(),
		e => gracely.server.unknown(e.message)
	)
}
