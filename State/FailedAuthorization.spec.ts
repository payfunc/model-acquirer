import * as isoly from "isoly"
import * as model from "@payfunc/model-card"
import * as acquirer from "../index"

describe("State.FailedAuthorization tests", () => {
	it("State.FailedAuthorization test", () => {
		const merchant: acquirer.Merchant = {
			id: "testtest",
			type: "test",
			agent: "master",
			categoryCode: "1234",
			country: "SE",
			name: "Test Merchant",
			reconciliation: { account: "exampleAccount", currency: "SEK", fees: { other: {} } },
			reference: "123456",
			rules: { master: [] },
		}
		const statistics: acquirer.Statistics = {
			merchant: "testtest",
			currency: "SEK",
			captured: {},
			refunded: {},
			settled: {},
			fees: {},
			reserves: {},
		}
		const card: model.Card.Creatable = {
			pan: "4111111111111111",
			expires: [2, 28],
			csc: "987",
		}
		const authorization: acquirer.Authorization.Creatable & { card: model.Card.Creatable } = {
			amount: 100,
			currency: "SEK",
			descriptor: "test transaction",
			number: "12345678",
			card,
		}
		const earlyFailure: acquirer.State.FailedAuthorization = {
			authorization: { status: ["failed"], created: isoly.DateTime.now(), reason: "bad input" },
			merchant: { id: "testtest" },
			log: [],
		}
		expect(acquirer.State.FailedAuthorization.is(earlyFailure)).toBeTruthy()
		const preAuthorization = {
			...acquirer.State.PreAuthorization.from(authorization, merchant, statistics, "verified", {
				EUR: 9.5,
				SEK: 1,
			}),
		}
		const lateFailure: acquirer.State.FailedAuthorization = {
			...preAuthorization,
			authorization: {
				...preAuthorization.authorization,
				status: ["failed"],
				reason: "rejected",
				created: isoly.DateTime.now(),
			},
			log: [],
		}
		expect(acquirer.State.FailedAuthorization.is(lateFailure)).toBeTruthy()
	})
	it("load", () => {
		expect(
			acquirer.State.FailedAuthorization.load(
				[
					acquirer.Authorization.calculateStatus({
						id: "1234567890000000",
						merchant: "testtest",
						number: "1234567890123456",
						created: "2021-02-01T23:59:59.000Z",
						currency: "SEK",
						history: [],
						reference: "",
						refund: [],
						capture: [],
						card: { iin: "123456", last4: "1234", expires: [3, 24], csc: "present", scheme: "visa", type: "debit" },
						amount: 100,
					}),
				],
				[
					{
						agent: "PayFunc",
						reference: { id: "1234567890abcdef", number: "1234123412341234", type: "authorization" },
						merchant: "testtest",
						client: "",
						resource: { method: "GET", location: "http://example.com" },
						created: "2021-02-02T23:59:59.000Z",
						entries: [
							{
								level: "trace",
								point: "request",
								data: {
									headers: {
										accept: ["*/*"],
										acceptEncoding: ["gzip"],
										authorization: "Bearer key.key.key",
										connection: "Keep-Alive",
										contentLength: "233",
										contentType: "application/json",
										host: "worker-authorization-development.authtest.workers.dev",
										userAgent: "PostmanRuntime/7.26.8",
										xForwardedProto: "https",
									},
									url: "https://worker-authorization-development.authtest.workers.dev/authorization",
								},
							},
							{
								level: "trace",
								point: "Authorization Data before Typeguards",
								data: {
									amount: 15,
									currency: "EUR",
								},
							},
							{
								level: "log",
								point: "PreAuthorization State",
								data: {
									state: {
										merchant: {
											descriptor: "Test Merchant",
											country: "SE",
											name: "Test Merchant",
											currency: "SEK",
											scheme: [],
											refundable: 9.66,
											captured: 10,
											settled: 0.24000000000000002,
											fees: 0.1,
										},
										authorization: {
											amount: 15,
											currency: "EUR",
											card: {
												scheme: "mastercard",
												iin: "520474",
												last4: "1002",
												expires: "2022-02-28",
												csc: "present",
											},
											descriptor: "string",
											number: "1234123412341234",
										},
										now: "2021-03-31",
									},
								},
							},
							{
								level: "log",
								point: "Ipg Response",
								data: {
									response: {
										clientRequestId: "83332605",
										apiTraceId: "rrt-01d417a497a71fc2d-a-de-16809-101275597-1",
										responseType: "GatewayDeclined",
										orderId: "uj0_7HzydkbNh09O",
										transactionTime: 1617189739,
										transactionStatus: "VALIDATION_FAILED",
										error: {
											code: "100",
											message: "Internal error",
										},
									},
								},
							},
							{
								level: "warning",
								point: "response",
								data: {
									status: 502,
									header: {
										contentType: "application/json; charset=utf-8",
										accessControlAllowOrigin: "*",
									},
									body: {
										status: 502,
										type: "backend failure",
										backend: "unknown",
										details: {
											code: "100",
											message: "Internal error",
										},
									},
								},
							},
						],
					},
				]
			)
		).toEqual([
			{
				authorization: {
					amount: 15,
					card: {
						csc: "present",
						expires: "2022-02-28",
						iin: "520474",
						last4: "1002",
						scheme: "mastercard",
					},
					created: "2021-02-02T23:59:59.000Z",
					currency: "EUR",
					descriptor: "string",
					number: "1234123412341234",
					reason: "Internal error",
				},
				log: [
					{
						agent: "PayFunc",
						client: "",
						created: "2021-02-02T23:59:59.000Z",
						entries: [
							{
								data: {
									headers: {
										accept: ["*/*"],
										acceptEncoding: ["gzip"],
										authorization: "Bearer key.key.key",
										connection: "Keep-Alive",
										contentLength: "233",
										contentType: "application/json",
										host: "worker-authorization-development.authtest.workers.dev",
										userAgent: "PostmanRuntime/7.26.8",
										xForwardedProto: "https",
									},
									url: "https://worker-authorization-development.authtest.workers.dev/authorization",
								},
								level: "trace",
								point: "request",
							},
							{
								data: {
									amount: 15,
									currency: "EUR",
								},
								level: "trace",
								point: "Authorization Data before Typeguards",
							},
							{
								data: {
									state: {
										authorization: {
											amount: 15,
											card: {
												csc: "present",
												expires: "2022-02-28",
												iin: "520474",
												last4: "1002",
												scheme: "mastercard",
											},
											created: "2021-02-02T23:59:59.000Z",
											currency: "EUR",
											descriptor: "string",
											number: "1234123412341234",
											reason: "Internal error",
										},
										merchant: {
											captured: 10,
											country: "SE",
											currency: "SEK",
											descriptor: "Test Merchant",
											fees: 0.1,
											name: "Test Merchant",
											refundable: 9.66,
											scheme: [],
											settled: 0.24000000000000002,
										},
										now: "2021-03-31",
									},
								},
								level: "log",
								point: "PreAuthorization State",
							},
							{
								data: {
									response: {
										apiTraceId: "rrt-01d417a497a71fc2d-a-de-16809-101275597-1",
										clientRequestId: "83332605",
										error: {
											code: "100",
											message: "Internal error",
										},
										orderId: "uj0_7HzydkbNh09O",
										responseType: "GatewayDeclined",
										transactionStatus: "VALIDATION_FAILED",
										transactionTime: 1617189739,
									},
								},
								level: "log",
								point: "Ipg Response",
							},
							{
								data: {
									body: {
										backend: "unknown",
										details: {
											code: "100",
											message: "Internal error",
										},
										status: 502,
										type: "backend failure",
									},
									header: {
										accessControlAllowOrigin: "*",
										contentType: "application/json; charset=utf-8",
									},
									status: 502,
								},
								level: "warning",
								point: "response",
							},
						],
						merchant: "testtest",
						reference: {
							id: "1234567890abcdef",
							number: "1234123412341234",
							type: "authorization",
						},
						resource: {
							location: "http://example.com",
							method: "GET",
						},
					},
				],
				merchant: { id: "testtest" },
			},
		])
	})
})
