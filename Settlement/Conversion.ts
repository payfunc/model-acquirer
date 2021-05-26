import * as isoly from "isoly"
import { Authorization } from "../Authorization"
import { Settlement } from "./Settlement"

export namespace Conversion {
	export function toCsv(settlements: Settlement[]): string {
		let result =
			"reference,merchant,start,end,payout date,payout amount,reserve release,reserve amount,created,gross,fee,interchange,net,currency,transactions\r\n"
		for (const settlement of settlements)
			result += `"${settlement.reference}","${settlement.merchant}","${settlement.period.start}","${
				settlement.period.end
			}","${settlement.payout}","${isoly.Currency.round(
				settlement.net - (settlement.reserve?.amount ?? 0),
				settlement.currency
			)}","${settlement.reserve?.payout ?? ""}","${settlement.reserve?.amount ?? 0}","${settlement.created}","${
				settlement.gross
			}","${typeof settlement.fee == "number" ? settlement.fee : settlement.fee.total}","${
				typeof settlement.fee == "number" ? 0 : settlement.fee.scheme
			}","${settlement.net}","${settlement.currency}","${settlement.transactions.length}"\r\n`
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
				result += `"${transaction.card}",`
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
