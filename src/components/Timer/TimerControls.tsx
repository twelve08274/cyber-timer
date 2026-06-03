import { useTimerStore } from '../../stores/timerStore'
import { playStart, playReset } from '../../hooks/useSound'

const btnBase: React.CSSProperties = {
  padding: '10px 28px',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.1em',
  cursor: 'pointer',
  border: '1px solid',
  background: 'transparent',
  transition: 'all 0.2s',
}

export function TimerControls() {
  const { status, start, pause, reset, skip } = useTimerStore()

  const handleStart = () => { playStart(); start() }
  const handleReset = () => { playReset(); reset() }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
      {status === 'running' ? (
        <button onClick={pause} style={{ ...btnBase, borderColor: '#00f5ff', color: '#00f5ff', background: 'rgba(0,245,255,0.1)', boxShadow: '0 0 12px rgba(0,245,255,0.2)' }}>
          ⏸ PAUSE
        </button>
      ) : (
        <button onClick={handleStart} style={{ ...btnBase, borderColor: '#00f5ff', color: '#00f5ff', background: 'rgba(0,245,255,0.1)', boxShadow: '0 0 12px rgba(0,245,255,0.2)' }}>
          ▶ START
        </button>
      )}
      <button onClick={handleReset} style={{ ...btnBase, borderColor: '#1e2d50', color: '#5a6a8a' }}>
        ↺ RESET
      </button>
      <button onClick={skip} style={{ ...btnBase, borderColor: '#1e2d50', color: '#5a6a8a' }}>
        ⏭ SKIP
      </button>
    </div>
  )
}
