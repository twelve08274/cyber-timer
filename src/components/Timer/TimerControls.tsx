import { useTimerStore } from '../../stores/timerStore'
import { useThemeStore } from '../../stores/themeStore'
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
  const t = useThemeStore(s => s.theme)()

  const handleStart = () => { playStart(); start() }
  const handleReset = () => { playReset(); reset() }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
      {status === 'running' ? (
        <button onClick={pause} style={{ ...btnBase, borderColor: t.primary, color: t.primary, background: `${t.primary}1a`, boxShadow: `0 0 12px ${t.primary}33` }}>
          ⏸ PAUSE
        </button>
      ) : (
        <button onClick={handleStart} style={{ ...btnBase, borderColor: t.primary, color: t.primary, background: `${t.primary}1a`, boxShadow: `0 0 12px ${t.primary}33` }}>
          ▶ START
        </button>
      )}
      <button onClick={handleReset} style={{ ...btnBase, borderColor: t.border, color: t.textDim }}>
        ↺ RESET
      </button>
      <button onClick={skip} style={{ ...btnBase, borderColor: t.border, color: t.textDim }}>
        ⏭ SKIP
      </button>
    </div>
  )
}
