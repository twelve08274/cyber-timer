import {} from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  trigger: boolean        // trueになった瞬間に発火
  mode: 'focus' | 'break' | 'longBreak'
}

/** モードごとの演出設定 */
const EFFECTS = {
  focus: {
    // サイバー系: シアン×パープル×ピンクの紙吹雪
    colors: ['#00f5ff', '#bf00ff', '#ff2d78', '#ffffff'],
    particleCount: 120,
    spread: 80,
    message: '🎉 FOCUS COMPLETE!',
    messageColor: '#00f5ff',
  },
  break: {
    // ブレイク: 優しい緑系
    colors: ['#00ff88', '#00f5ff', '#ffffff'],
    particleCount: 60,
    spread: 60,
    message: '✨ BREAK TIME!',
    messageColor: '#00ff88',
  },
  longBreak: {
    // ロングブレイク: 豪華なゴールド×パープル
    colors: ['#f5c400', '#bf00ff', '#ff2d78', '#00f5ff'],
    particleCount: 200,
    spread: 100,
    message: '🏆 LONG BREAK!',
    messageColor: '#bf00ff',
  },
}

export function useCompletionEffect() {
  const fire = (mode: 'focus' | 'break' | 'longBreak') => {
    const { colors, particleCount, spread } = EFFECTS[mode]

    // 左右から同時に発射
    confetti({
      particleCount: Math.floor(particleCount * 0.6),
      spread,
      origin: { x: 0.2, y: 0.6 },
      colors,
      ticks: 200,
      gravity: 0.8,
      scalar: 1.2,
    })
    confetti({
      particleCount: Math.floor(particleCount * 0.6),
      spread,
      origin: { x: 0.8, y: 0.6 },
      colors,
      ticks: 200,
      gravity: 0.8,
      scalar: 1.2,
    })

    // 少し遅れて中央からも
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(particleCount * 0.4),
        spread: spread * 1.2,
        origin: { x: 0.5, y: 0.5 },
        colors,
        ticks: 150,
        startVelocity: 25,
        scalar: 0.9,
      })
    }, 200)
  }

  return { fire }
}

/** セッション完了時のフラッシュ＋メッセージオーバーレイ */
export function CompletionOverlay({ trigger, mode }: Props) {
  const effect = EFFECTS[mode]

  return (
    <AnimatePresence>
      {trigger && (
        <>
          {/* 画面フラッシュ */}
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: effect.messageColor,
              pointerEvents: 'none',
              zIndex: 50,
            }}
          />

          {/* 完了メッセージ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              position: 'fixed',
              top: '38%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: '0.05em',
              color: effect.messageColor,
              textShadow: `0 0 30px ${effect.messageColor}, 0 0 60px ${effect.messageColor}80`,
              whiteSpace: 'nowrap',
            }}>
              {effect.message}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
