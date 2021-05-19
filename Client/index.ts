import { Authorization as ClientAuthorization } from "./Authorization"
import { Connection } from "./Connection"
import { Merchant as ClientMerchant } from "./Merchant"
import { Settlement as ClientSettlement } from "./Settlement"
import { Verification as ClientVerification } from "./Verification"

export class Client {
	authorization = new ClientAuthorization(this)
	merchant = new ClientMerchant(this)
	settlement = new ClientSettlement(this)
	verification = new ClientVerification(this)
	private constructor(readonly connection: Connection) {}

	static open(url: string, token: string): Client
	static open(url: string | undefined, token: string | undefined): Client | undefined
	static open(url: string | undefined, token: string | undefined): Client | undefined {
		const connection = Connection.open(url, token)
		return connection && new Client(connection)
	}
}
