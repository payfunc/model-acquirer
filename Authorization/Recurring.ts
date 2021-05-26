import * as selectively from "selectively"

export type Recurring = "initial" | InitialRecurring | SubsequentRecurring | ScheduledRecurring
type InitialRecurring = { type: "initial"; initiator: "cardholder" }
type SubsequentRecurring = {
	type: "subsequent"
	reference: string
	scheduled?: false
	initiator: "cardholder" | "merchant"
}
type ScheduledRecurring = { type: "subsequent"; reference: string; scheduled: true; initiator: "merchant" }

export namespace Recurring {
	export function is(value: any | Recurring): value is Recurring {
		return value == "initial" || isInitial(value) || isSubsequent(value) || isScheduled(value)
	}
	function isInitial(value: any | InitialRecurring): value is InitialRecurring {
		return typeof value == "object" && value.type == "initial" && value.initiator == "cardholder"
	}
	function isSubsequent(value: any | SubsequentRecurring): value is SubsequentRecurring {
		return (
			typeof value == "object" &&
			value.type == "subsequent" &&
			typeof value.reference == "string" &&
			["cardholder", "merchant"].includes(value.initiator) &&
			value.scheduled != true
		)
	}
	function isScheduled(value: any | ScheduledRecurring): value is ScheduledRecurring {
		return (
			typeof value == "object" &&
			value.initiator == "merchant" &&
			value.reference == "string" &&
			value.scheduled == true &&
			value.type == "subsequent"
		)
	}
	export namespace Template {
		export const initial = new selectively.Type.Object({
			type: new selectively.Type.String("initial"),
			initiator: new selectively.Type.String("cardholder"),
		})
		export const subsequent = new selectively.Type.Object({
			type: new selectively.Type.String("initial"),
			initiator: new selectively.Type.Union([
				new selectively.Type.String("cardholder"),
				new selectively.Type.String("merchant"),
			]),
			reference: new selectively.Type.String(),
		})
		export const scheduled = new selectively.Type.Object({
			type: new selectively.Type.String("initial"),
			initiator: new selectively.Type.String("merchant"),
			reference: new selectively.Type.String(),
			scheduled: new selectively.Type.Boolean(),
		})
	}
}
