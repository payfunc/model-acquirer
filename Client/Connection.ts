import * as gracely from "gracely"
import { Error } from "../Error"

export class Connection {
	private constructor(readonly url: string, readonly token: string) {}

	async fetch<Response>(
		path: string,
		method: string,
		request?: any,
		tokenize?: true
	): Promise<Response | gracely.Error> {
		const response = await fetch(this.url + "/" + path, {
			method,
			headers: {
				Accept: tokenize ? "application/jwt" : "*/*",
				"Content-Type": "application/json; charset=utf-8",
				Authorization: "Bearer " + this.token,
			},
			body: JSON.stringify(request),
		}).catch(_ => undefined)
		return !response
			? Error.unavailable()
			: response.headers.get("Content-Type")?.startsWith("application/json")
			? response.json()
			: response.text()
	}
	async get<Response>(path: string): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "GET")
	}
	async patch<Response>(path: string, request: any): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PATCH", request)
	}
	async post<Response>(path: string, request: any, tokenize?: true): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "POST", request, tokenize)
	}
	async put<Response>(path: string, request: any): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "PUT", request)
	}
	async remove<Response>(path: string): Promise<Response | gracely.Error> {
		return await this.fetch<Response>(path, "DELETE")
	}
	static open(url: string | undefined, token: string | undefined): Connection | undefined {
		return token && url ? new Connection(url, token) : undefined
	}
}
