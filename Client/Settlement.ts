import * as gracely from "gracely"
import * as authly from "authly"
import { Settlement as ModelSettlement } from "../Settlement"
import { Connection } from "./Connection"

export class Settlement {
	constructor(readonly client: { connection: Connection }) {}
	async load(
		id?: authly.Identifier | authly.Identifier[]
	): Promise<ModelSettlement | ModelSettlement[] | gracely.Error> {
		return !id
			? await this.client.connection.get<ModelSettlement[]>("settlement")
			: authly.Identifier.is(id)
			? await this.client.connection.get<ModelSettlement>("settlement/" + id)
			: (await Promise.all(id.map(i => this.client.connection.get<ModelSettlement>("settlement/" + i)))).filter(
					ModelSettlement.is
			  )
	}
}
