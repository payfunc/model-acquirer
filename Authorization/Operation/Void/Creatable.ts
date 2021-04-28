export interface Creatable {
	type: "void"
}
export namespace Creatable {
	export function is(value: any | Creatable): value is Creatable {
		return typeof value == "object" && value.type == "void"
	}
}
