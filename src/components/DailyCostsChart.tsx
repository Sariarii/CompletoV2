import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DailyPoint {
  date: string
  grossEUR: number
  refactureEUR: number
}

function formatDate(d: string): string {
  const [year, month, day] = d.split('-')
  return `${day}/${month}`
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function DailyCostsChart({ data }: { data: DailyPoint[] }) {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id='colorRefacture' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#1B4FE0' stopOpacity={0.4} />
              <stop offset='95%' stopColor='#1B4FE0' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' stroke='#EEF2FF' />
          <XAxis
            dataKey='date'
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: '#6B7693' }}
          />
          <YAxis tickFormatter={formatEUR} tick={{ fontSize: 11, fill: '#6B7693' }} />
          <Tooltip
            formatter={(v: number) => formatEUR(v)}
            labelFormatter={(l) => `Date : ${l}`}
            contentStyle={{ borderRadius: 8, border: '1px solid #E5E9F2', fontSize: 12 }}
          />
          <Area
            type='monotone'
            dataKey='refactureEUR'
            name='Refacturé HT'
            stroke='#1B4FE0'
            strokeWidth={2.5}
            fill='url(#colorRefacture)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
