import { Authorization as ClientAuthorization } from "./Authorization"
import { Connection } from "./Connection"

export class Client {
	authorization = new ClientAuthorization(this)
	private constructor(readonly connection: Connection) {}

	static open(url: string, token: string): Client
	static open(url: string | undefined, token: string | undefined): Client | undefined
	static open(url: string | undefined, token: string | undefined): Client | undefined {
		const connection = Connection.open(url, token)
		return connection && new Client(connection)
	}
}
