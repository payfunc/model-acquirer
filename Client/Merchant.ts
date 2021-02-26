import * as gracely from "gracely"
import * as authly from "authly"
import { Merchant as ModelMerchant } from "../Merchant"
import { Connection } from "./Connection"

export class Merchant {
	constructor(readonly client: { connection: Connection }) {}
	async create(request: ModelMerchant): Promise<ModelMerchant | gracely.Error> {
		return await this.client.connection.post<ModelMerchant>("authorization/merchant", request)
	}
	async load(id?: authly.Identifier | authly.Identifier[]): Promise<ModelMerchant | ModelMerchant[] | gracely.Error> {
		return !id
			? await this.client.connection.get<ModelMerchant[]>("authorization/merchant")
			: authly.Identifier.is(id)
			? await this.client.connection.get<ModelMerchant>("authorization/merchant/" + id)
			: (
					await Promise.all(id.map(i => this.client.connection.get<ModelMerchant>("authorization/merchant/" + i)))
			  ).filter(ModelMerchant.is)
	}
}
