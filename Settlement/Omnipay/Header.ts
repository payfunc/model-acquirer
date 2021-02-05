import * as isoly from "isoly"

export interface Header {
	fileCreateDate: isoly.DateTime
	institutionID: string
	fundingDate: isoly.Date
	postingDate: isoly.Date
}
