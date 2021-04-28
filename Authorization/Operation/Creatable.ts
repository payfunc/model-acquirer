import * as authly from "authly"
import { Capture } from "./Capture"
import { Change } from "./Change"
import { Refund } from "./Refund"
import { Void } from "./Void"

export type Creatable = Record<
	authly.Identifier,
	Change.Creatable | Capture.Creatable | Refund.Creatable | Void.Creatable
>

export namespace Creatable {
	export function is(value: any | Creatable): value is Creatable {
		return (
			typeof value == "object" &&
			Object.entries(value).every(
				v =>
					authly.Identifier.is(v[0], 16) &&
					(Change.Creatable.is(v[1]) ||
						Capture.Creatable.is(v[1]) ||
						Refund.Creatable.is(v[1]) ||
						Void.Creatable.is(v[1]))
			)
		)
	}
}
