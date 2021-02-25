import * as gracely from "gracely"
import { default as fetch } from "isomorphic-fetch"

export class Connection {
	private constructor(readonly url: string, readonly token: string) {}

	async fetch<Response>(path: string, method: string, request?: any): Promise<Response | gracely.Error> {
		const response = await fetch(this.url + "/" + path, {
			method,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: "Bearer " + this.token,
			},
			body: JSON.stringify(request),
		}).catch(_ => undefined)
		return !response
			? gracely.server.unavailable()
			: response.headers.get("Content-Type")?.startsWith("application/json")
			? response.json()
			: response.text()
	}
	async post<Response>(path: string, request: any): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "POST", request)
	}
	async get<Response>(path: string, request: any): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "GET", request)
	}
	async remove<Response>(path: string): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "DELETE")
	}
	static open(url: string | undefined, token: string | undefined): Connection | undefined {
		return token && url ? new Connection(url, token) : undefined
	}
}
