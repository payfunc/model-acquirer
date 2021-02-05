import * as isoly from "isoly"

export interface Reserves {
	capturedToday: number
	refundedToday: number
	history: { capture: number; refund: number; expiryDate: isoly.Date }[]
	settlement: { amount: number; expiryDate: isoly.Date; reference: string }[] // Settlement amount held back as reserves
}

export namespace Reserves {
	export function calculateRefundable(reserves: Reserves): number {
		return 0
	}
	export function calculateCaptured(reserves: Reserves): number {
		return 0
	}
}
