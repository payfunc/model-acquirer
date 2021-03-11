import * as gracely from "gracely"
import { Authorization as ModelAuthorization } from "../Authorization"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Connection } from "./Connection"

interface Operations {
	cancel: () => Promise<gracely.Result>
	capture: (request: Capture.Creatable) => Promise<Capture | gracely.Error>
	refund: (request: Refund.Creatable) => Promise<Refund | gracely.Error>
}
export class Authorization {
	constructor(readonly client: { connection: Connection }) {}
	async create(request: ModelAuthorization.Creatable): Promise<(ModelAuthorization & Operations) | gracely.Error> {
		const result = await this.client.connection.post<ModelAuthorization>("authorization", request)
		return gracely.Error.is(result) ? result : this.load(result)
	}
	load(authorization: ModelAuthorization): ModelAuthorization & Operations
	load(authorization: string): { id: string } & Operations
	load(authorization: ModelAuthorization | string): (ModelAuthorization | { id: string }) & Operations
	load(authorization: ModelAuthorization | string): (ModelAuthorization | { id: string }) & Operations {
		const result = {
			...(typeof authorization == "string" ? { id: authorization } : authorization),
			cancel: (): Promise<gracely.Result> => this.client.connection.remove("authorization/" + result.id),
			capture: (capture: Capture.Creatable): Promise<Capture | gracely.Error> =>
				this.client.connection.post("authorization/" + result.id + "/capture", capture),
			refund: (refund: Refund.Creatable): Promise<Refund | gracely.Error> =>
				this.client.connection.post("authorization/" + result.id + "/refund", refund),
		}
		return result
	}
}
