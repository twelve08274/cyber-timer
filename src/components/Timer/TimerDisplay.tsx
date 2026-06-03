import { motion } from 'framer-motion'
import { useTimerStore } from '../../stores/timerStore'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

const MODE_LABELS = {
  focus:     '◈ FOCUS MODE ◈',
  break:     '◇ BREAK TIME ◇',
  longBreak: '◆ LONG BREAK ◆',
}

const MODE_COLORS = {
  focus:     '#00f5ff',
  break:     '#00ff88',
  longBreak: '#bf00ff',
}

export function TimerDisplay() {
  const { remaining, total, mode, session } = useTimerStore()
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const progress = total > 0 ? (total - remaining) / total : 0
  const color = MODE_COLORS[mode]

  return (
    <div style={{ textAlign: 'center' }}>
      {/* モードラベル */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: 12,
          letterSpacing: '0.2em',
          color,
          fontWeight: 700,
          marginBottom: 24,
          opacity: 0.8,
        }}
      >
        {MODE_LABELS[mode]}
      </motion.div>

      {/* タイマー数字 */}
      <motion.div
        key={`${mins}-${secs}`}
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.1 }}
        style={{
          fontSize: 'clamp(72px, 16vw, 108px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color,
          textShadow: `0 0 30px ${color}80, 0 0 60px ${color}40`,
          marginBottom: 28,
          fontVariantNumeric: 'tabular-nums',
          fontFamily: 'monospace',
        }}
      >
        {pad(mins)}:{pad(secs)}
      </motion.div>

      {/* プログレスバー */}
      <div style={{
        width: '100%',
        height: 4,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
        marginBottom: 16,
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, #bf00ff, ${color})`,
            borderRadius: 2,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>

      {/* セッション表示 */}
      <div style={{ fontSize: 12, color: '#5a6a8a', letterSpacing: '0.06em' }}>
        Session{' '}
        <span style={{ color: '#f5c400', fontWeight: 700 }}>{session}</span>
        {' '}/{' '}4
      </div>
    </div>
  )
}
