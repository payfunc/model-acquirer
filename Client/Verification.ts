import * as gracely from "gracely"
import { Verification as ModelVerification } from "../Verification"
import { Connection } from "./Connection"

export class Verification {
	constructor(readonly client: { connection: Connection }) {}
	async create(request: ModelVerification.Creatable, tokenize?: true): Promise<ModelVerification | gracely.Error> {
		return await this.client.connection.post<ModelVerification>("verification/", request, tokenize)
	}
}
