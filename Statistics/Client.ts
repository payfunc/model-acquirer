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
			settle: async (settlement, date) => await settle(date, settlement, stub),
			refund: async (amount, currency) => await refund(amount, currency, stub),
			rebuild: async (authorizations, settlements, rate) => await rebuild(authorizations, rate, settlements, stub),
		}
	}
	static open(connection: DurableObjectNamespace): Client {
		return new Client(connection)
	}
}

async function stubFetch<T>(
	stub: DurableObjectStub,
	resource: string,
	body: Record<string, any>
): Promise<T | gracely.Error> {
	return await stub.fetch(resource, { method: "POST", body: JSON.stringify(body) }).then(
		r => r.json(),
		e => gracely.server.unknown(e.message)
	)
}

async function capture(
	amount: number,
	currency: isoly.Currency,
	stub: DurableObjectStub
): Promise<Statistics | gracely.Error> {
	return await stubFetch<Statistics>(stub, "capture", { amount, currency })
}
async function get(
	currency: isoly.Currency,
	rate: Record<string, number>,
	stub: DurableObjectStub
): Promise<Statistics | gracely.Error> {
	return await stubFetch<Statistics>(stub, "get", { currency, rate })
}
async function settle(
	date: isoly.Date,
	settlement: Settlement,
	stub: DurableObjectStub
): Promise<Statistics | gracely.Error> {
	return await stubFetch<Statistics>(stub, "settle", { date, settlement })
}
async function refund(
	amount: number,
	currency: isoly.Currency,
	stub: DurableObjectStub
): Promise<Statistics | gracely.Error> {
	return await stubFetch<Statistics>(stub, "refund", { amount, currency })
}
async function rebuild(
	authorizations: Authorization[],
	rate: Record<string, number>,
	settlements: Settlement[],
	stub: DurableObjectStub
): Promise<Statistics[] | gracely.Error> {
	return await stubFetch<Statistics[]>(stub, "refund", { authorizations, rate, settlements })
}
