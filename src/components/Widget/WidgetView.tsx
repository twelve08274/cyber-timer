import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null)
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

  // ESCで閉じる・右クリックメニューを外クリックで閉じる
  useEffect(() => {
    const onKey = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        try { await getCurrentWindow().close() } catch {}
      }
    }
    const onDown = () => setCtxMenu(null)
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
    }
  }, [])

  const closeWindow = async () => { try { await getCurrentWindow().close() } catch {} }

  return (
    <div
      onMouseDown={handleDragStart}
      onContextMenu={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY }) }}
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
      <div onMouseDown={e => e.stopPropagation()}>
        <button
          onClick={() => status === 'running' ? pause() : start()}
          style={{
            padding: '3px 18px',
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
          {status === 'running' ? '⏸ PAUSE' : '▶ START'}
        </button>
      </div>

      {/* 右クリックコンテキストメニュー */}
      <AnimatePresence>
        {ctxMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.1 }}
            onMouseDown={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: ctxMenu.y,
              left: ctxMenu.x,
              background: `${theme.cardBg}f0`,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              overflow: 'hidden',
              zIndex: 9999,
              minWidth: 130,
            }}
          >
            {[
              { label: status === 'running' ? '⏸ 一時停止' : '▶ 開始', action: () => { status === 'running' ? pause() : start(); setCtxMenu(null) } },
              { label: '✕ ウィジェットを閉じる', action: closeWindow },
            ].map((item, i) => (
              <button key={i} onClick={item.action}
                style={{
                  display: 'block', width: '100%',
                  padding: '8px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: i === 0 ? `1px solid ${theme.border}` : 'none',
                  color: i === 1 ? theme.accent : '#c8d8f0',
                  fontSize: 11, fontWeight: 600,
                  textAlign: 'left', cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${theme.primary}18`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
