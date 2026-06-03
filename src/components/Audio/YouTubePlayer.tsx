import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useYouTubeStore } from '../../stores/youtubeStore'
import { useAudioStore } from '../../stores/audioStore'

declare global {
  interface Window {
    YT: {
      Player: new (el: string | HTMLElement, opts: object) => YTPlayer
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  setVolume(v: number): void
  getVideoData(): { title?: string }
  destroy(): void
}

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) { resolve(); return }
    window.onYouTubeIframeAPIReady = () => resolve()
    if (!document.querySelector('#yt-api-script')) {
      const script = document.createElement('script')
      script.id = 'yt-api-script'
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    }
  })
}

export function YouTubePlayer() {
  const { videoId, videoTitle, status, volume, loadUrl, setPlayer, setStatus, setTitle, setVolume, play, pause, stop } =
    useYouTubeStore()
  const { stop: stopBGM, track } = useAudioStore()

  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    loadYouTubeAPI().then(() => setApiReady(true))
  }, [])

  useEffect(() => {
    if (!apiReady || !videoId || !containerRef.current) return
    if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null }

    const div = document.createElement('div')
    div.id = 'yt-player-inner'
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(div)

    playerRef.current = new window.YT.Player('yt-player-inner', {
      videoId,
      width: '100%',
      height: '100%',
      playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0 },
      events: {
        onReady: (e: { target: YTPlayer }) => {
          e.target.setVolume(volume)
          e.target.playVideo()
          setPlayer(e.target)
          try { const t = e.target.getVideoData()?.title; if (t) setTitle(t) } catch {}
          setStatus('playing')
          if (track !== 'none') stopBGM()
        },
        onStateChange: (e: { data: number }) => {
          if (e.data === window.YT.PlayerState.PLAYING) setStatus('playing')
          else if (e.data === window.YT.PlayerState.PAUSED) setStatus('paused')
          else if (e.data === window.YT.PlayerState.ENDED) setStatus('idle')
        },
        onError: () => {
          setStatus('error')
          setTitle('再生できない動画です（埋め込み禁止）')
          setTimeout(() => setStatus('idle'), 3000)
        },
      },
    })
  }, [apiReady, videoId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputUrl.trim()
    if (!trimmed) return
    loadUrl(trimmed)
    setInputUrl('')
  }

  const isActive = status === 'playing' || status === 'paused'

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0d1225, #0a0d1f)',
      border: `1px solid ${isActive ? '#ff2d7840' : '#1e2d50'}`,
      borderRadius: 12,
      padding: 20,
      marginTop: 16,
      transition: 'border-color 0.3s',
      boxShadow: isActive ? '0 0 20px rgba(255,45,120,0.05)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#e8f0ff' }}>▶️ YouTube BGM</span>
        {status === 'loading' && (
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
            style={{ fontSize: 10, color: '#5a6a8a' }}>読み込み中...</motion.span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input
          type="text" value={inputUrl} onChange={e => setInputUrl(e.target.value)}
          placeholder="YouTube URLを貼り付け..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #1e2d50', background: 'rgba(255,255,255,0.04)', color: '#c8d8f0', fontSize: 12, outline: 'none' }}
          onFocus={e => e.target.style.borderColor = '#ff2d78'}
          onBlur={e => e.target.style.borderColor = '#1e2d50'}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ff2d78', background: 'rgba(255,45,120,0.1)', color: '#ff2d78', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          再生
        </button>
      </form>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontSize: 11, color: '#ff6b6b', marginBottom: 10 }}>⚠️ {videoTitle}</motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            {videoTitle && (
              <div style={{ fontSize: 11, color: '#c8d8f0', marginBottom: 10, padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                🎬 {videoTitle}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => status === 'playing' ? pause() : play()}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #ff2d78', background: 'rgba(255,45,120,0.1)', color: '#ff2d78', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {status === 'playing' ? '⏸' : '▶'}
              </button>
              <button onClick={stop}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #1e2d50', background: 'transparent', color: '#5a6a8a', fontSize: 12, cursor: 'pointer' }}>
                ⏹ 停止
              </button>
              <span style={{ fontSize: 12, marginLeft: 'auto' }}>🔊</span>
              <input type="range" min="0" max="100" value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                style={{ width: 80, accentColor: '#ff2d78' }} />
              <span style={{ fontSize: 11, color: '#5a6a8a', minWidth: 28 }}>{volume}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} style={{ width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none', position: 'absolute' }} />
      <div style={{ fontSize: 10, color: '#3a4a6a', marginTop: 8 }}>※ 埋め込み禁止設定の動画は再生できません</div>
    </div>
  )
}
