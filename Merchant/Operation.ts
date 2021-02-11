export type Operation = "authorization" | "capture" | "refund" | "void" | "all"

export namespace Operation {
	export function is(value: any | Operation): value is Operation {
		return types.some(t => value == t)
	}
	export const types: Operation[] = ["authorization", "capture", "refund", "void", "all"]
}
