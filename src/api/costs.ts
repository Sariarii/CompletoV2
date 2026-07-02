/**
 * Client de coûts AWS — 100% front.
 *
 * Il n'y a plus de backend : les données sont générées localement par
 * mockCostGenerator.ts (même logique déterministe que l'ancienne API
 * simulée). L'interface (getCostAndUsage / getTags) reste identique afin
 * que le reste de l'app n'ait rien à changer.
 */

import { generateCostAndUsage, generateTags } from './mockCostGenerator'
import type { TimePeriod, GroupBy, GetCostAndUsageResponse } from './costs.types'

export type {
  TimePeriod,
  GroupBy,
  MetricValue,
  Group,
  ResultByTime,
  GetCostAndUsageResponse,
} from './costs.types'

export function getCostAndUsage(
  period: TimePeriod,
  groupBy?: GroupBy,
): Promise<GetCostAndUsageResponse> {
  try {
    return Promise.resolve(generateCostAndUsage(period, groupBy))
  } catch (err) {
    return Promise.reject(err)
  }
}

export function getTags(): Promise<{ Tags: string[]; ReturnSize: number }> {
  return Promise.resolve(generateTags())
}
