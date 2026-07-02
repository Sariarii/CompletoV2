/**
 * Client de l'API simulée AWS Cost Explorer.
 *
 * En dev, les appels passent par le proxy Vite (/api/cost-explorer -> http://localhost:3030).
 * En prod, il suffira de changer VITE_COST_API_URL vers la vraie API Gateway.
 */

const API_BASE = import.meta.env.VITE_COST_API_URL || '/api/cost-explorer';

// ============================================
// Types côté API (miroir de openapi.yaml)
// ============================================

export interface TimePeriod {
  Start: string; // yyyy-mm-dd
  End: string;   // yyyy-mm-dd (exclusif)
}

export interface GroupBy {
  Type: 'DIMENSION' | 'TAG';
  Key: string; // 'SERVICE' pour DIMENSION, nom du tag pour TAG
}

export interface MetricValue {
  Amount: string; // décimale en string (conforme AWS)
  Unit: string;   // "USD"
}

export interface Group {
  Keys: string[];
  Metrics: {
    UnblendedCost: MetricValue;
  };
}

export interface ResultByTime {
  TimePeriod: TimePeriod;
  Total: {
    UnblendedCost: MetricValue;
  };
  Groups: Group[];
  Estimated: boolean;
}

export interface GetCostAndUsageResponse {
  GroupDefinitions: GroupBy[];
  ResultsByTime: ResultByTime[];
  DimensionValueAttributes: unknown[];
}

// ============================================
// Appels API
// ============================================

async function callApi<T>(target: string, body: unknown): Promise<T> {
  const resp = await fetch(API_BASE + '/', {
    method: 'POST',
    headers: {
      'X-Amz-Target': target,
      'Content-Type': 'application/x-amz-json-1.1',
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API ${resp.status} : ${err}`);
  }
  return resp.json() as Promise<T>;
}

export function getCostAndUsage(period: TimePeriod, groupBy?: GroupBy): Promise<GetCostAndUsageResponse> {
  return callApi<GetCostAndUsageResponse>(
    'AWSInsightsIndexService.GetCostAndUsage',
    groupBy ? { TimePeriod: period, GroupBy: [groupBy] } : { TimePeriod: period }
  );
}

export function getTags(): Promise<{ Tags: string[]; ReturnSize: number }> {
  return callApi('AWSInsightsIndexService.GetTags', {});
}
