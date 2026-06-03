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
import { useTimer, registerCompletionSetter, type CompletionState } from './hooks/useTimer'
import { useKeyboard } from './hooks/useKeyboard'
import { usePlaylistStore } from './stores/playlistStore'
import { useThemeStore } from './stores/themeStore'
import { ThemePicker } from './components/Theme/ThemePicker'
import './App.css'

type Page = 'timer' | 'playlist'

function App() {
  const [page, setPage] = useState<Page>('timer')
  const [completion, setCompletion] = useState<CompletionState>({ show: false, mode: 'focus' })
  const { playlists } = usePlaylistStore()
  const theme = useThemeStore(s => s.theme)()

  useEffect(() => {
    registerCompletionSetter(setCompletion)
  }, [])

  useTimer()
  useKeyboard()

  return (
    <div style={{
      background: theme.bg,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#c8d8f0',
    }}>
      <AnimatePresence mode="wait">
        {page === 'timer' ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ padding: '24px 24px' }}
          >
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
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
                    background: 'linear-gradient(90deg, #00f5ff, #bf00ff)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ⏱ Cyber Timer
                  </h1>
                  <p style={{ color: '#5a6a8a', fontSize: 12, margin: 0 }}>
                    テンション爆上げ集中タイマー
                  </p>
                </div>

                {/* プレイリストボタン */}
                <button
                  onClick={() => setPage('playlist')}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: '1px solid #1e2d50',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#5a6a8a',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 4,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#ff2d78'
                    e.currentTarget.style.color = '#ff2d78'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#1e2d50'
                    e.currentTarget.style.color = '#5a6a8a'
                  }}
                >
                  🎵
                  <span>プレイリスト</span>
                  {playlists.length > 0 && (
                    <span style={{
                      background: '#ff2d78',
                      color: '#fff',
                      borderRadius: 10,
                      padding: '0 6px',
                      fontSize: 10,
                      fontWeight: 700,
                    }}>
                      {playlists.length}
                    </span>
                  )}
                </button>
              </div>

              {/* タイマー */}
              <TimerDisplay />
              <TimerControls />

              {/* 統計 */}
              <TodayStats />
              <WeeklyChart />

              {/* BGM */}
              <BGMPlayer />
              <YouTubePlayer />

              {/* テーマ */}
              <ThemePicker />

              {/* フッター */}
              <div style={{
                textAlign: 'center',
                marginTop: 24,
                paddingTop: 16,
                borderTop: '1px solid #1e2d50',
                fontSize: 10,
                color: '#5a6a8a',
                letterSpacing: '0.06em',
              }}>
                <span style={{ opacity: 0.5 }}>Space: 開始/停止 &nbsp;·&nbsp; R: リセット &nbsp;·&nbsp; S: スキップ</span>
              </div>
            </div>
          </motion.div>
        ) : (
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
      </AnimatePresence>

      {/* 完了エフェクト（全画面） */}
      <CompletionOverlay trigger={completion.show} mode={completion.mode} />
    </div>
  )
}

export default App
