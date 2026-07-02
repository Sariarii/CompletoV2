import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface ServiceData {
  service: string
  grossEUR: number
  marginEUR: number
  totalEUR: number
}

const COLORS = [
  '#1B4FE0',
  '#FF7849',
  '#10B981',
  '#A78BFA',
  '#F59E0B',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
]

function formatEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function ServiceBreakdownChart({
  data,
  isClient,
}: {
  data: ServiceData[]
  isClient: boolean
}) {
  const chartData = data.map((d) => ({
    name: d.service,
    value: isClient ? d.totalEUR : d.grossEUR,
  }))
  const total = chartData.reduce((s, d) => s + d.value, 0)

  return (
    <div style={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1, height: '100%', position: 'relative' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              dataKey='value'>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => formatEUR(v)} />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
          <div style={{ fontSize: 11, color: '#6B7693' }}>Total</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0D1B3D' }}>{formatEUR(total)}</div>
        </div>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, minWidth: 140 }}>
        {chartData.map((d, i) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: COLORS[i % COLORS.length],
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#6B7693', flex: 1 }}>
              {d.name.replace(/^Amazon /, '').replace(/^AWS /, '')}
            </span>
            <b style={{ color: '#0D1B3D' }}>{((d.value / total) * 100).toFixed(0)}%</b>
          </div>
        ))}
      </div>
    </div>
  )
}
