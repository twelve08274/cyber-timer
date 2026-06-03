import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TimerDisplay } from './components/Timer/TimerDisplay'
import { TimerControls } from './components/Timer/TimerControls'
import { TodayStats } from './components/Stats/TodayStats'
import { WeeklyChart } from './components/Stats/WeeklyChart'
import { BGMPlayer } from './components/Audio/BGMPlayer'
import { YouTubePlayer } from './components/Audio/YouTubePlayer'
import { CompletionOverlay } from './components/Effects/CompletionEffect'
import { PlaylistManager } from './components/Playlist/PlaylistManager'
import { SettingsPage } from './components/Settings/SettingsPage'
import { useTimer, registerCompletionSetter, type CompletionState } from './hooks/useTimer'
import { useKeyboard } from './hooks/useKeyboard'
import { usePlaylistStore } from './stores/playlistStore'
import { useThemeStore } from './stores/themeStore'
import { ThemeIllustration } from './components/Theme/ThemeIllustration'
import { SideEffect } from './components/Theme/SideEffects'
import './App.css'

// ウィジェット窓を開く
async function openWidget() {
  try {
    const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow')
    const existing = await WebviewWindow.getByLabel('widget')
    if (existing) { await existing.setFocus(); return }
    new WebviewWindow('widget', {
      url: '/?widget',
      title: 'Cyber Timer Widget',
      width: 220,
      height: 110,
      minWidth: 180,
      minHeight: 90,
      alwaysOnTop: true,
      decorations: false,
      transparent: true,
      resizable: false,
      skipTaskbar: true,
    })
  } catch (e) { console.warn('widget:', e) }
}

// Tauri window icon switching (no-op in browser)
async function setWindowIcon(themeId: string) {
  try {
    const res = await fetch(`/icons/${themeId}.png`)
    if (!res.ok) return
    const buf = await res.arrayBuffer()
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const { Image } = await import('@tauri-apps/api/image')
    const img = await Image.fromBytes(new Uint8Array(buf))
    await getCurrentWindow().setIcon(img)
  } catch {}
}

type Page = 'timer' | 'playlist' | 'settings'

function App() {
  const [page, setPage] = useState<Page>('timer')
  const [completion, setCompletion] = useState<CompletionState>({ show: false, mode: 'focus' })
  const { playlists } = usePlaylistStore()
  const { themeId, theme } = useThemeStore()
  const t = theme()

  useEffect(() => {
    registerCompletionSetter(setCompletion)
  }, [])

  // テーマ変更時にウィンドウアイコンを切替
  useEffect(() => {
    setWindowIcon(themeId)
  }, [themeId])

  useTimer()
  useKeyboard()

  return (
    <div style={{
      background: t.bg,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#c8d8f0',
    }}>
      <AnimatePresence mode="wait">
        {page === 'timer' && (
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', minHeight: '100vh' }}
          >
            {/* 左サイドパネル */}
            <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
              <SideEffect side="left" />
            </div>

            {/* メインコンテンツ */}
            <div style={{ width: 500, flexShrink: 0, padding: '24px 16px' }}>
              {/* ヘッダー */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <h1 style={{
                    fontSize: 32,
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.4,
                    margin: '0 0 4px 0',
                    padding: '4px 0 0 0',
                    background: `linear-gradient(90deg, ${t.primary}, ${t.secondary})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ⏱ Cyber Timer
                  </h1>
                  <p style={{ color: t.textDim, fontSize: 12, margin: 0 }}>
                    テンション爆上げ集中タイマー
                  </p>
                </div>

                {/* ヘッダーボタン群 */}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    onClick={openWidget}
                    title="ウィジェットを開く"
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: `1px solid ${t.border}`,
                      background: 'rgba(255,255,255,0.03)',
                      color: t.textDim,
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = t.primary; e.currentTarget.style.color = t.primary }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;  e.currentTarget.style.color = t.textDim }}
                  >
                    🪟
                  </button>
                  <button
                    onClick={() => setPage('playlist')}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: `1px solid ${t.border}`,
                      background: 'rgba(255,255,255,0.03)',
                      color: t.textDim,
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = t.accent
                      e.currentTarget.style.color = t.accent
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = t.border
                      e.currentTarget.style.color = t.textDim
                    }}
                  >
                    🎵
                    {playlists.length > 0 && (
                      <span style={{
                        background: t.accent,
                        color: '#fff',
                        borderRadius: 10,
                        padding: '0 5px',
                        fontSize: 10,
                        fontWeight: 700,
                      }}>
                        {playlists.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setPage('settings')}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: `1px solid ${t.border}`,
                      background: 'rgba(255,255,255,0.03)',
                      color: t.textDim,
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = t.primary
                      e.currentTarget.style.color = t.primary
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = t.border
                      e.currentTarget.style.color = t.textDim
                    }}
                  >
                    ⚙️
                  </button>
                </div>
              </div>

              {/* タイマー */}
              <TimerDisplay />
              <TimerControls />

              {/* 統計 */}
              <TodayStats />
              <WeeklyChart />

              {/* テーマイラスト */}
              <ThemeIllustration />

              {/* BGM */}
              <BGMPlayer />
              <YouTubePlayer />

              {/* フッター */}
              <div style={{
                textAlign: 'center',
                marginTop: 24,
                paddingTop: 16,
                borderTop: `1px solid ${t.border}`,
                fontSize: 10,
                color: t.textDim,
                letterSpacing: '0.06em',
                opacity: 0.6,
              }}>
                Space: 開始/停止 &nbsp;·&nbsp; R: リセット &nbsp;·&nbsp; S: スキップ &nbsp;·&nbsp; ⚙️: 設定
              </div>
            </div>

            {/* 右サイドパネル */}
            <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
              <SideEffect side="right" />
            </div>
          </motion.div>
        )}

        {page === 'playlist' && (
          <motion.div
            key="playlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <PlaylistManager onClose={() => setPage('timer')} />
          </motion.div>
        )}

        {page === 'settings' && (
          <SettingsPage onClose={() => setPage('timer')} />
        )}
      </AnimatePresence>

      {/* 完了エフェクト（全画面） */}
      <CompletionOverlay trigger={completion.show} mode={completion.mode} />
    </div>
  )
}

export default App
