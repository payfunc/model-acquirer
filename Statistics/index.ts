import { Client as StatisticsClient, Operations as StatisticsOperations } from "./Client"
import { Statistics as ModelStatistics } from "./Statistics"

export type Statistics = ModelStatistics
export namespace Statistics {
	export const applySettlement = ModelStatistics.applySettlement
	export const initialize = ModelStatistics.initialize
	export const is = ModelStatistics.is
	export const merge = ModelStatistics.merge
	export const refundable = ModelStatistics.refundable
	export const sum = ModelStatistics.sum
	export const summarize = ModelStatistics.summarize

	export type Client = StatisticsClient
	export namespace Client {
		export const open = StatisticsClient.open
	}
	export type Operations = StatisticsOperations
}
