import { useAudioStore, type BGMTrack } from '../../stores/audioStore'
import { motion, AnimatePresence } from 'framer-motion'

const TRACK_ORDER: BGMTrack[] = ['lofi', 'rain', 'whitenoise', 'cafe', 'none']

// 再生中インジケーター（3本のバー）
function NowPlayingBars() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 12, marginLeft: 4 }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          style={{
            display: 'block',
            width: 3,
            height: '100%',
            background: '#00f5ff',
            borderRadius: 1,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </span>
  )
}

export function BGMPlayer() {
  const { track, volume, playing, tracks, setTrack, setVolume, toggle } = useAudioStore()

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0d1225, #0a0d1f)',
      border: `1px solid ${playing ? '#00f5ff40' : '#1e2d50'}`,
      borderRadius: 12,
      padding: 20,
      marginTop: 24,
      transition: 'border-color 0.3s',
      boxShadow: playing ? '0 0 20px rgba(0,245,255,0.05)' : 'none',
    }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e8f0ff' }}>🎵 BGM</span>
          <AnimatePresence>
            {playing && track !== 'none' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NowPlayingBars />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 再生/停止トグル */}
        {track !== 'none' && (
          <button
            onClick={toggle}
            style={{
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              border: '1px solid',
              borderColor: playing ? '#00f5ff' : '#1e2d50',
              background: playing ? 'rgba(0,245,255,0.1)' : 'transparent',
              color: playing ? '#00f5ff' : '#5a6a8a',
              cursor: 'pointer',
            }}
          >
            {playing ? '⏸' : '▶'}
          </button>
        )}
      </div>

      {/* トラック選択 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {TRACK_ORDER.map(t => {
          const isActive = track === t
          return (
            <button
              key={t}
              onClick={() => setTrack(t)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                border: '1px solid',
                background: isActive ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: isActive ? '#00f5ff' : '#1e2d50',
                color: isActive ? '#00f5ff' : '#5a6a8a',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: isActive ? '0 0 8px rgba(0,245,255,0.2)' : 'none',
              }}
            >
              {tracks[t].emoji} {tracks[t].label}
            </button>
          )
        })}
      </div>

      {/* ボリュームスライダー */}
      <AnimatePresence>
        {track !== 'none' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 }}>
              <span style={{ fontSize: 14 }}>🔈</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(volume * 100)}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                style={{ flex: 1, accentColor: '#00f5ff' }}
              />
              <span style={{ fontSize: 11, color: '#5a6a8a', minWidth: 28, textAlign: 'right' }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
