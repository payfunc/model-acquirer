import * as gracely from "gracely"
import * as authly from "authly"
import { Authorization } from "../Authorization"
import { Capture } from "../Capture"
import { Refund } from "../Refund"
import { Connection } from "./Connection"

export class Client {
	private constructor(readonly connection: Connection) {}
	async create(request: Authorization.Creatable): Promise<Authorization | gracely.Error> {
		return this.connection.post("authorization", request)
	}
	async cancel(authorization: Authorization | authly.Identifier): Promise<gracely.Result> {
		return this.connection.remove(
			"authorization/" + (typeof authorization == "string" ? authorization : authorization.id) + "/cancel"
		)
	}
	async capture(
		authorization: Authorization | authly.Identifier,
		request: Capture.Creatable
	): Promise<Capture | gracely.Error> {
		return this.connection.post(
			"authorization/" + (typeof authorization == "string" ? authorization : authorization.id) + "/capture",
			request
		)
	}
	async refund(
		authorization: Authorization | authly.Identifier,
		request: Refund.Creatable
	): Promise<Refund | gracely.Error> {
		return this.connection.post(
			"authorization/" + (typeof authorization == "string" ? authorization : authorization.id) + "/cancel",
			request
		)
	}

	static open(url: string, token: string): Client
	static open(url: string | undefined, token: string | undefined): Client | undefined
	static open(url: string | undefined, token: string | undefined): Client | undefined {
		const connection = Connection.open(url, token)
		return connection && new Client(connection)
	}
}
