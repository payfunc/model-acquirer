export type Action = "reject" | "review"

export namespace Action {
	export const types = ["reject", "review"]
	export function is(value: any | Action): value is Action {
		return types.some(t => t == value)
	}
}
