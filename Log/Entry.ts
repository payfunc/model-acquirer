export interface Entry {
	level: "trace" | "log" | "warning" | "exception"
	point: string | "request" | "response" | "catch"
	data: Record<string, any>
}
export namespace Entry {
	export function is(value: Entry | any): value is Entry {
		return (
			typeof value == "object" &&
			["trace", "log", "warning", "exception"].some(l => l == value.level) &&
			typeof value.point == "string" &&
			typeof value.data == "object" &&
			Object.keys(value.data).every(key => typeof key == "string")
		)
	}
}
