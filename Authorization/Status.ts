export type Status = "authorized" | "cancelled" | "captured" | "refunded" | "settled"

export namespace Status {
	export const types: Status[] = ["authorized", "cancelled", "captured", "refunded", "settled"]
	export function is(value: Status | any): value is Status {
		return types.some(v => v == value)
	}
}
