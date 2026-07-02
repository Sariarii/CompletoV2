export interface TimePeriod {
  Start: string; // yyyy-mm-dd
  End: string; // yyyy-mm-dd (exclusif)
}

export interface GroupBy {
  Type: 'DIMENSION' | 'TAG';
  Key: string; // 'SERVICE' pour DIMENSION, nom du tag pour TAG
}

export interface MetricValue {
  Amount: string; // décimale en string (conforme AWS)
  Unit: string; // "USD"
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
