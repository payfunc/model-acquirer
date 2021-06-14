import { History } from "./index"

const pendingPreauth: History = {
	browser: {
		acceptHeader: "*/*",
		colorDepth: 24,
		java: false,
		javascript: true,
		locale: "en-US",
		parent: "http://localhost:3333",
		resolution: [2560, 1440],
		timezone: -120,
		userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
	},
	currency: "EUR",
	date: "2021-06-14T14:13:16.694Z",
	items: 1,
	merchant: "testtest",
	number: "21IzpdsZHie4oJcI",
	recurring: {
		initiator: "cardholder",
		type: "initial",
	},
	response: {
		preauthorization: {
			acsEndProtocolVersion: "2.2.0",
			acsStartProtocolVersion: "2.1.0",
			dsEndProtocolVersion: "2.2.0",
			dsStartProtocolVersion: "2.1.0",
			messageType: "CRD",
			scheme: "standin",
			threeDSMethodURL: "https://acs.sandbox.3dsecure.io/3dsmethod",
			threeDSServerTransID: "ac80bcae-27f9-4308-97a6-bcef25793b9c",
		},
	},
	status: "pending",
	step: "preauthorization",
	target:
		"http://localhost:7100/card/12.Yi_xuOMVbSAPsqUoogGd3w.atb79ylBhI--e2khQyf8vuv65NzEBvcLk0un_CfZGYHoSbs_0222/verification?mode=iframe&parent=http://localhost:3333",
	type: "verification",
}
const pendingAuth: History = {
	browser: {
		acceptHeader: "*/*",
		colorDepth: 24,
		java: false,
		javascript: true,
		locale: "en-US",
		parent: "http://localhost:3333",
		resolution: [2560, 1440],
		timezone: -120,
		userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
	},
	currency: "EUR",
	date: "2021-06-14T14:13:18.660Z",
	items: 1,
	merchant: "testtest",
	number: "21IzpdsZHie4oJcI",
	recurring: {
		initiator: "cardholder",
		type: "initial",
	},
	response: {
		authorization: {
			acsChallengeMandated: "N",
			acsOperatorID: "3dsecureio-standin-acs",
			acsReferenceNumber: "3dsecureio-standin-acs",
			acsTransID: "ed476e98-40de-48df-a55d-b13baef7aea1",
			acsURL: "https://acs.sandbox.3dsecure.io/browser/challenge/manual",
			authenticationType: "01",
			dsReferenceNumber: "3dsecureio-standin-ds",
			dsTransID: "a0bf2f11-9368-4898-be0b-fd5314c912b2",
			messageType: "ARes",
			messageVersion: "2.2.0",
			threeDSServerTransID: "ac80bcae-27f9-4308-97a6-bcef25793b9c",
			transStatus: "C",
		},
		method: {
			messageVersion: "2.2.0",
			threeDSServerTransID: "ac80bcae-27f9-4308-97a6-bcef25793b9c",
		},
	},
	status: "pending",
	step: "authorization",
	target:
		"http://localhost:7100/card/12.aRXzrWVgnU4KS-xY77kSUA.ceraXpu0Qxuh-GAfHTf_VgQ9S7kKXtB3OdV75fCH-RCIeoNd0222/verification?mode=iframe&parent=http://localhost:3333",
	type: "verification",
}
const successPostAuth: History = {
	browser: {
		acceptHeader: "*/*",
		colorDepth: 24,
		java: false,
		javascript: true,
		locale: "en-US",
		parent: "http://localhost:3333",
		resolution: [2560, 1440],
		timezone: -120,
		userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
	},
	currency: "EUR",
	date: "2021-06-14T14:13:20.800Z",
	items: 1,
	merchant: "testtest",
	number: "21IzpdsZHie4oJcI",
	recurring: {
		initiator: "cardholder",
		type: "initial",
	},
	response: {
		challenge: {
			acsTransID: "ed476e98-40de-48df-a55d-b13baef7aea1",
			challengeCompletionInd: "Y",
			messageType: "CRes",
			messageVersion: "2.2.0",
			threeDSServerTransID: "ac80bcae-27f9-4308-97a6-bcef25793b9c",
			transStatus: "Y",
		},
		postauthorization: {
			acsTransID: "ed476e98-40de-48df-a55d-b13baef7aea1",
			authenticationType: "01",
			authenticationValue: "28oQUBZwIc2E16nA0W4qwixG0A0=",
			dsTransID: "a0bf2f11-9368-4898-be0b-fd5314c912b2",
			eci: "05",
			interactionCounter: "00",
			messageCategory: "02",
			messageType: "RReq",
			messageVersion: "2.2.0",
			threeDSServerTransID: "ac80bcae-27f9-4308-97a6-bcef25793b9c",
			transStatus: "Y",
		},
	},
	status: "success",
	step: "postauthorization",
	target:
		"http://localhost:7100/card/12.VW8fWPl56uuL9wrrk359pg.4FSu9RZ8ZiKnz7SsxI59MgiJd8jIT-ZHfFaiJ-9ZraAHeNSH0222/verification?mode=iframe&parent=http://localhost:3333",
	type: "verification",
}

const histories: History[] = [
	pendingPreauth,
	pendingAuth,
	successPostAuth,
	{
		date: "2021-06-14T14:13:22.495Z",
		merchant: "testtest",
		number: "21IzpdsZHie4oJcI",
		status: "success",
		type: "create",
		verification: "verified",
	},
]

describe("History tests", () => {
	it("Pre", () => {
		expect(History.is(pendingPreauth)).toBe(true)
	})
	it("Auth", () => {
		expect(History.is(pendingAuth)).toBe(true)
	})
	it("Post", () => {
		expect(History.is(successPostAuth)).toBe(true)
	})
	it("Actual test", () => {
		expect(histories.every(History.is)).toBe(true)
	})
})
