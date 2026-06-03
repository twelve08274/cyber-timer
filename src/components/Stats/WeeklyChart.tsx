import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { useStatsStore } from '../../stores/statsStore'

function formatMinutes(seconds: number) {
  const m = Math.floor(seconds / 60)
  if (m >= 60) return `${Math.floor(m / 60)}h${m % 60 > 0 ? `${m % 60}m` : ''}`
  return `${m}m`
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

// カスタムツールチップ
function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0d1225',
      border: '1px solid #1e2d50',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 12,
    }}>
      <div style={{ color: '#5a6a8a', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#00f5ff', fontWeight: 700 }}>
        {formatMinutes(payload[0].value * 60)}
      </div>
    </div>
  )
}

export function WeeklyChart() {
  const getWeekStats = useStatsStore(s => s.getWeekStats)
  const getStreak = useStatsStore(s => s.getStreak)
  const week = getWeekStats()
  const streak = getStreak()
  const todayIndex = 6  // 右端が今日

  const data = week.map((d, i) => {
    const date = new Date(d.date)
    return {
      day: DAY_LABELS[date.getDay()],
      minutes: Math.round(d.focusSeconds / 60),
      sessions: d.sessions,
      isToday: i === todayIndex,
    }
  })

  const maxMin = Math.max(...data.map(d => d.minutes), 30)
  const totalWeek = data.reduce((acc, d) => acc + d.minutes, 0)

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0d1225, #0a0d1f)',
      border: '1px solid #1e2d50',
      borderRadius: 12,
      padding: '20px 20px 12px',
      marginTop: 24,
    }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f0ff' }}>📊 週間統計</div>
          <div style={{ fontSize: 11, color: '#5a6a8a', marginTop: 2 }}>
            今週合計: <span style={{ color: '#00f5ff', fontWeight: 700 }}>{formatMinutes(totalWeek * 60)}</span>
          </div>
        </div>
        {streak > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 20,
            background: 'rgba(245,196,0,0.1)',
            border: '1px solid rgba(245,196,0,0.3)',
          }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f5c400' }}>{streak}日連続</span>
          </div>
        )}
      </div>

      {/* バーチャート */}
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barSize={24} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fill: '#5a6a8a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, maxMin]}
            tick={{ fill: '#5a6a8a', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v === 0 ? '' : `${v}m`}
            ticks={[0, Math.round(maxMin / 2), maxMin]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.isToday
                    ? '#00f5ff'
                    : entry.minutes > 0
                    ? '#1e4a6a'
                    : '#0d1a2e'
                }
                opacity={entry.isToday ? 1 : 0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 凡例 */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: '#00f5ff' }} />
          <span style={{ fontSize: 10, color: '#5a6a8a' }}>今日</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: '#1e4a6a' }} />
          <span style={{ fontSize: 10, color: '#5a6a8a' }}>実績あり</span>
        </div>
      </div>
    </div>
  )
}
