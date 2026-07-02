/**
 * Générateur de coûts AWS simulés — 100% front, aucun appel réseau.
 *
 * Reprend fidèlement la logique qui vivait auparavant dans le backend
 * Node (server.js) : PRNG déterministe (LCG) + saisonnalité légère,
 * pour obtenir des montants stables et reproductibles à chaque rendu.
 *
 * Jeu de données : 01/01/2022 -> 31/03/2022, projet fictif « Photos de presse ».
 */

import type { TimePeriod, GroupBy, GetCostAndUsageResponse, ResultByTime, Group } from './costs.types';

interface ServiceDef {
  key: string;
  label: string;
  weight: number;
  vary: number;
}

// Services AWS utilisés par le projet client fictif
const SERVICES: ServiceDef[] = [
  { key: 'AmazonLambda', label: 'AWS Lambda', weight: 0.4, vary: 0.25 },
  { key: 'AmazonDynamoDB', label: 'Amazon DynamoDB', weight: 0.25, vary: 0.15 },
  { key: 'AmazonS3', label: 'Amazon S3', weight: 0.15, vary: 0.05 },
  { key: 'AmazonCloudFront', label: 'Amazon CloudFront', weight: 0.09, vary: 0.2 },
  { key: 'AmazonCognito', label: 'Amazon Cognito', weight: 0.05, vary: 0.05 },
  { key: 'AmazonCloudWatch', label: 'Amazon CloudWatch', weight: 0.03, vary: 0.1 },
  { key: 'AmazonManagedBlockchain', label: 'AWS Managed Blockchain', weight: 0.02, vary: 0.3 },
  { key: 'AmazonRekognition', label: 'Amazon Rekognition', weight: 0.01, vary: 0.4 },
];

// Tags configurables côté projet fictif
const AVAILABLE_TAGS: Array<{ key: string; values: string[] }> = [
  { key: 'Project', values: ['prod-photos-presse', 'staging-photos-presse', 'dev-photos-presse'] },
  { key: 'Environment', values: ['prod', 'staging', 'dev'] },
  { key: 'CostCenter', values: ['EG-001', 'EG-002', 'RV-001'] },
  { key: 'Owner', values: ['lab-42c', 'lab-42c-finops'] },
  { key: 'ManagedBy', values: ['CDK', 'Manual'] },
];

// === PRNG simple (LCG) — reproductible, même algorithme que le backend ===
function pseudoRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return {
    next(): number {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    },
  };
}

function daysBetween(startStr: string, endStr: string): Date[] {
  const start = new Date(startStr + 'T00:00:00Z');
  const end = new Date(endStr + 'T00:00:00Z');
  const days: Date[] = [];
  const cur = new Date(start);
  while (cur < end) {
    days.push(new Date(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}

function genDailyCost(date: Date): number {
  const dayOfMonth = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const seed = parseInt(`${date.getUTCFullYear()}${String(month).padStart(2, '0')}${String(dayOfMonth).padStart(2, '0')}`);
  const rng = pseudoRandom(seed);
  const baseUSD = 95;
  const noise = (rng.next() - 0.5) * 30; // +/- 15 USD
  const trend = (dayOfMonth / 31) * 25; // hausse progressive sur le mois
  return Math.max(20, baseUSD + noise + trend);
}

export function generateCostAndUsage(period: TimePeriod, groupBy?: GroupBy): GetCostAndUsageResponse {
  if (!period || !period.Start || !period.End) {
    throw new Error('TimePeriod.Start et TimePeriod.End requis (format yyyy-mm-dd)');
  }

  const days = daysBetween(period.Start, period.End);
  if (days.length === 0) {
    throw new Error('La plage de dates est vide ou inversée');
  }

  const ResultsByTime: ResultByTime[] = days.map((d) => {
    const dateStr = d.toISOString().slice(0, 10);
    const total = genDailyCost(d);

    const result: ResultByTime = {
      TimePeriod: {
        Start: dateStr,
        End: new Date(d.getTime() + 86400000).toISOString().slice(0, 10),
      },
      Total: {
        UnblendedCost: { Amount: total.toFixed(4), Unit: 'USD' },
      },
      Groups: [],
      Estimated: false,
    };

    if (groupBy && groupBy.Type === 'DIMENSION' && groupBy.Key === 'SERVICE') {
      result.Groups = SERVICES.map((svc, idx): Group => {
        const rng = pseudoRandom(d.getUTCDate() * 100 + idx);
        const variation = 1 + (rng.next() - 0.5) * svc.vary * 2;
        const amount = total * svc.weight * variation;
        return {
          Keys: [svc.label],
          Metrics: {
            UnblendedCost: { Amount: amount.toFixed(4), Unit: 'USD' },
          },
        };
      });
    } else if (groupBy && groupBy.Type === 'TAG') {
      const tag = AVAILABLE_TAGS.find((t) => t.key === groupBy.Key);
      if (tag) {
        result.Groups = tag.values.map((val, idx): Group => {
          const share = idx === 0 ? 0.8 : 0.2 / Math.max(1, tag.values.length - 1);
          return {
            Keys: [`${groupBy.Key}$${val}`],
            Metrics: {
              UnblendedCost: { Amount: (total * share).toFixed(4), Unit: 'USD' },
            },
          };
        });
      }
    }

    return result;
  });

  return {
    GroupDefinitions: groupBy ? [groupBy] : [],
    ResultsByTime,
    DimensionValueAttributes: [],
  };
}

export function generateTags(): { Tags: string[]; ReturnSize: number } {
  return {
    Tags: AVAILABLE_TAGS.flatMap((t) => t.values.map((v) => `${t.key}$${v}`)),
    ReturnSize: AVAILABLE_TAGS.reduce((s, t) => s + t.values.length, 0),
  };
}
