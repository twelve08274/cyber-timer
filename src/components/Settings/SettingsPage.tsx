import { motion } from 'framer-motion'
import { useThemeStore, THEMES, THEME_ORDER } from '../../stores/themeStore'
import { useTimerStore } from '../../stores/timerStore'

interface Props {
  onClose: () => void
}

export function SettingsPage({ onClose }: Props) {
  const { themeId, setTheme, theme } = useThemeStore()
  const t = theme()
  const { focusDuration, breakDuration, longBreakDuration, setFocusDuration, setBreakDuration, setLongBreakDuration } = useTimerStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2 }}
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: '#c8d8f0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              color: t.textDim,
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            ← 戻る
          </button>
          <h2 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
            background: `linear-gradient(90deg, ${t.primary}, ${t.secondary})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ⚙️ 設定
          </h2>
        </div>

        {/* テーマ選択 */}
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 12, letterSpacing: '0.15em', color: t.textDim, margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            テーマ
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {THEME_ORDER.map(id => {
              const th = THEMES[id]
              const isActive = themeId === id
              return (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  style={{
                    padding: '14px 8px',
                    borderRadius: 12,
                    border: `2px solid ${isActive ? th.primary : t.border}`,
                    background: isActive ? `${th.primary}18` : `${t.cardBg}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    boxShadow: isActive ? `0 0 16px ${th.primary}40` : 'none',
                  }}
                >
                  {/* カラープレビュー */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: th.primary }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: th.secondary }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: th.accent }} />
                  </div>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{th.emoji}</div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: isActive ? th.primary : t.textDim,
                    letterSpacing: '0.05em',
                  }}>
                    {th.name}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* タイマー設定 */}
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 12, letterSpacing: '0.15em', color: t.textDim, margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            タイマー設定
          </h3>
          <div style={{
            background: t.bg2,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            {[
              { label: 'フォーカス時間', value: focusDuration, setter: setFocusDuration, min: 1, max: 90 },
              { label: '休憩時間', value: breakDuration, setter: setBreakDuration, min: 1, max: 30 },
              { label: '長い休憩', value: longBreakDuration, setter: setLongBreakDuration, min: 5, max: 60 },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: i < 2 ? `1px solid ${t.border}` : 'none',
                }}
              >
                <span style={{ fontSize: 13, color: '#c8d8f0' }}>{item.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={() => item.setter(Math.max(item.min, item.value - 1))}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: `1px solid ${t.border}`,
                      background: 'transparent', color: t.textDim,
                      cursor: 'pointer', fontSize: 16, lineHeight: 1,
                    }}
                  >−</button>
                  <span style={{ fontSize: 15, fontWeight: 700, color: t.primary, minWidth: 42, textAlign: 'center' }}>
                    {item.value}分
                  </span>
                  <button
                    onClick={() => item.setter(Math.min(item.max, item.value + 1))}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: `1px solid ${t.border}`,
                      background: 'transparent', color: t.textDim,
                      cursor: 'pointer', fontSize: 16, lineHeight: 1,
                    }}
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* キーボードショートカット */}
        <section>
          <h3 style={{ fontSize: 12, letterSpacing: '0.15em', color: t.textDim, margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            キーボードショートカット
          </h3>
          <div style={{
            background: t.bg2,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            {[
              { key: 'Space', desc: '開始 / 一時停止' },
              { key: 'R', desc: 'リセット' },
              { key: 'S', desc: 'スキップ' },
            ].map((item, i) => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderBottom: i < 2 ? `1px solid ${t.border}` : 'none',
                }}
              >
                <span style={{ fontSize: 13, color: t.textDim }}>{item.desc}</span>
                <kbd style={{
                  padding: '3px 10px',
                  borderRadius: 4,
                  border: `1px solid ${t.border}`,
                  background: `${t.primary}12`,
                  color: t.primary,
                  fontSize: 11,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}>
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
