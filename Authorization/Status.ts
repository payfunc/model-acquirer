export type Status = "authorized" | "captured" | "refunded" | "settled"

export namespace Status {
	export const types: Status[] = ["authorized", "captured", "refunded", "settled"]
	export function is(value: Status | any): value is Status {
		return types.some(v => v == value)
	}
}
