import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTimerStore } from '../../stores/timerStore'
import { useThemeStore } from '../../stores/themeStore'
import { getCurrentWindow } from '@tauri-apps/api/window'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

const MODE_LABELS: Record<string, string> = {
  focus:     'FOCUS',
  break:     'BREAK',
  longBreak: 'LONG BREAK',
}

export function WidgetView() {
  const { remaining, mode, status, start, pause } = useTimerStore()
  const theme = useThemeStore(s => s.theme)()
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const modeColors: Record<string, string> = {
    focus:     theme.primary,
    break:     theme.secondary,
    longBreak: theme.accent,
  }
  const color = modeColors[mode] ?? theme.primary

  // body/html を透過に
  useEffect(() => {
    document.documentElement.style.background = 'transparent'
    document.body.style.background = 'transparent'
    const root = document.getElementById('root')
    if (root) {
      root.style.background = 'transparent'
      root.style.border = 'none'
      root.style.width = '100%'
      root.style.maxWidth = '100%'
    }
  }, [])

  // ドラッグで窓を移動
  const handleDragStart = async () => {
    try {
      const win = getCurrentWindow()
      await win.startDragging()
    } catch {}
  }

  // ESC or ダブルクリックで閉じる
  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        try { await getCurrentWindow().close() } catch {}
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      onMouseDown={handleDragStart}
      style={{
        width: '100vw',
        height: '100vh',
        background: `${theme.cardBg}99`,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${color}44`,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        cursor: 'grab',
        userSelect: 'none',
        boxShadow: `0 0 20px ${color}22`,
        overflow: 'hidden',
      }}
    >
      {/* モードラベル */}
      <div style={{
        fontSize: 9,
        letterSpacing: '0.2em',
        color,
        fontWeight: 700,
        opacity: 0.8,
      }}>
        {MODE_LABELS[mode]}
      </div>

      {/* タイマー */}
      <motion.div
        key={`${mins}-${secs}`}
        initial={{ scale: 0.97 }}
        animate={{ scale: 1 }}
        style={{
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          fontFamily: 'monospace',
          color,
          textShadow: `0 0 16px ${color}88`,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {pad(mins)}:{pad(secs)}
      </motion.div>

      {/* ボタン */}
      <div
        style={{ display: 'flex', gap: 8 }}
        onMouseDown={e => e.stopPropagation()} // ドラッグ誤爆防止
      >
        <button
          onClick={() => status === 'running' ? pause() : start()}
          style={{
            padding: '3px 14px',
            borderRadius: 6,
            border: `1px solid ${color}`,
            background: `${color}22`,
            color,
            fontSize: 10,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.08em',
          }}
        >
          {status === 'running' ? '⏸' : '▶'}
        </button>
        <button
          onClick={async () => { try { await getCurrentWindow().close() } catch {} }}
          style={{
            padding: '3px 8px',
            borderRadius: 6,
            border: `1px solid ${theme.border}`,
            background: 'transparent',
            color: theme.textDim,
            fontSize: 10,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
