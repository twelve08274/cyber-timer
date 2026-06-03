import { useStatsStore } from '../../stores/statsStore'

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function TodayStats() {
  const getTodayStats = useStatsStore(s => s.getTodayStats)
  const stats = getTodayStats()

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0d1225, #0a0d1f)',
      border: '1px solid #00f5ff',
      borderRadius: 12,
      padding: 28,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 40px rgba(0,245,255,0.08), inset 0 0 40px rgba(0,245,255,0.03)',
      marginTop: 32,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        marginTop: 16,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#bf00ff' }}>
            {stats.sessions}
          </div>
          <div style={{ fontSize: 10, color: '#5a6a8a', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>
            Sessions
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#ff2d78' }}>
            {formatTime(stats.focusSeconds)}
          </div>
          <div style={{ fontSize: 10, color: '#5a6a8a', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>
            Today
          </div>
        </div>
      </div>
    </div>
  )
}
