interface KpiCardProps {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  trendLabel: string;
  primary?: boolean;
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(n);
}

export default function KpiCard({ label, value, trend, trendLabel, primary }: KpiCardProps) {
  return (
    <div className={`kpi ${primary ? 'kpi-primary' : ''}`}>
      <div className="label">{label}</div>
      <div className="value">{formatEUR(value)}</div>
      <span className={`trend ${trend}`}>{trendLabel}</span>
    </div>
  );
}
