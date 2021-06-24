import * as isoly from "isoly"
import { Authorization } from "../Authorization"
import { Settlement } from "./Settlement"

export namespace Conversion {
	export function toCsv(settlements: Settlement[]): string {
		let result = ""
		result += "reference,"
		result += "merchant,"
		result += "start,"
		result += "end,"
		result += "payout date,"
		result += "payout amount,"
		result += "reserve release,"
		result += "reserve amount,"
		result += "created,"
		result += "gross,"
		result += "fee,"
		result += "interchange,"
		result += "net,"
		result += "currency,"
		result += "transactions\r\n"
		for (const settlement of settlements) {
			result += `"${settlement.reference}",`
			result += `"${settlement.merchant}",`
			result += `"${settlement.period.start}",`
			result += `"${settlement.period.end}",`
			result += `"${settlement.payout ?? ""}",`
			result += `"${isoly.Currency.round(settlement.net - (settlement.reserve?.amount ?? 0), settlement.currency)}",`
			result += `"${settlement.reserve?.payout ?? ""}",`
			result += `"${settlement.reserve?.amount ?? 0}",`
			result += `"${settlement.created}",`
			result += `"${settlement.gross}",`
			result += `"${typeof settlement.fee == "number" ? settlement.fee : settlement.fee.total}",`
			result += `"${typeof settlement.fee == "number" ? 0 : settlement.fee.scheme}",`
			result += `"${settlement.net}",`
			result += `"${settlement.currency}",`
			result += `"${settlement.transactions.length}"`
			result += `\r\n`
		}
		return result
	}
	export function toDetailedCsv(settlements: Settlement[], authorizations: Authorization[]): string {
		let result = ""
		result += "merchant,"
		result += "settlement reference,"
		result += "operation,"
		result += "posting date,"
		result += "authorization id,"
		result += "authorization number,"
		result += "card IIN,"
		result += "card type,"
		result += "card scheme,"
		result += "scheme reference,"
		result += "issuer country,"
		result += "currency,"
		result += "payout date,"
		result += "payout amount,"
		result += "reserve release,"
		result += "reserve amount,"
		result += "gross,"
		result += "fee,"
		result += "interchange,"
		result += "net"
		result += "\r\n"
		for (const settlement of settlements) {
			for (const transaction of settlement.transactions) {
				const authorization = authorizations.find(a => transaction.authorization == a.id)
				result += `"${settlement.merchant}",`
				result += `"${settlement.reference}",`
				result += `"${transaction.type}",`
				result += `"${transaction.created}",`
				result += `"${transaction.authorization}",`
				result += `"${authorization?.number ?? ""}",`
				result += `"${authorization?.card.iin ?? ""}",`
				result += `"${transaction.card}",`
				result += `"${transaction.scheme}",`
				result += `"${transaction.reference}",`
				result += `"${transaction.area}",`
				result += `"${transaction.currency}",`
				result += `"${settlement?.payout ?? ""}",`
				result += `"${isoly.Currency.round(
					transaction.net - (transaction.reserve?.amount ?? 0),
					transaction.currency
				)}",`
				result += `"${transaction.reserve?.payout ?? ""}",`
				result += `"${transaction.reserve?.amount ?? 0}",`
				result += `"${transaction.gross}",`
				result += `"${typeof transaction.fee == "number" ? transaction.fee : transaction.fee.total}",`
				result += `"${typeof transaction.fee == "number" ? 0 : transaction.fee.scheme}",`
				result += `"${transaction.net}"`
				result += `\r\n`
			}
		}
		return result
	}
}
