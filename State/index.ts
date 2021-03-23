import { Merchant } from "./Merchant"
import { PostAuthorization } from "./PostAuthorization"
import { PreAuthorization } from "./PreAuthorization"

export { Merchant, PostAuthorization, PreAuthorization }

export function lastDayOfMonth(year: number, month: number): "28" | "29" | "30" | "31" {
	let result: "28" | "29" | "30" | "31"
	switch (month) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
		default:
			result = "31"
			break
		case 4:
		case 6:
		case 9:
		case 11:
			result = "30"
			break
		case 2:
			result = year % 4 == 0 ? "29" : "28"
			break
	}
	return result
}
