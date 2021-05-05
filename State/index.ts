import { Log } from "@payfunc/model-log"
import { Authorization as AcquirerAuthorization } from "../Authorization"
import { Authorization } from "./Authorization"
import { Card } from "./Card"
import { FailedAuthorization } from "./FailedAuthorization"
import { Merchant } from "./Merchant"
import { PostAuthorization } from "./PostAuthorization"
import { PreAuthorization } from "./PreAuthorization"

export { Authorization, Card, FailedAuthorization, Merchant, PostAuthorization, PreAuthorization }

export function loadAuthorizations(
	authorizations: AcquirerAuthorization[],
	logs: Log[],
	merchants?: Merchant[]
): (Authorization | FailedAuthorization)[] {
	const registry: Record<string, { authorization?: AcquirerAuthorization; log: Log[]; merchant?: Merchant }> = {}
	for (const authorization of authorizations)
		registry[authorization.number ?? authorization.id] = {
			authorization,
			log: [],
			merchant: merchants?.find(m => m.id == authorization.merchant),
		}
	for (const log of logs)
		if (log.reference?.number && ["authorization", "verification"].includes(log.reference.type)) {
			if (!registry[log.reference.number])
				registry[log.reference.number] = { log: [] }
			registry[log.reference.number].log.push(log)
		}
	return Object.values(registry).map(v =>
		v.authorization
			? Authorization.from(v.authorization, v.merchant ?? { id: v.authorization.merchant }, v.log)
			: FailedAuthorization.from(v.log)
	)
}
