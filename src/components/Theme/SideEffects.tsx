import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useThemeStore, type ThemeId } from '../../stores/themeStore'

// ---- Cyber: 流れ落ちるデータストリーム ----
function CyberSide({ side, primary, secondary }: { side: 'left'|'right'; primary: string; secondary: string }) {
  const cols = side === 'left' ? [20, 50, 80] : [20, 50, 80]
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {cols.map((x, ci) =>
        [0,1,2,3,4].map(ri => (
          <motion.div
            key={`${ci}-${ri}`}
            style={{
              position: 'absolute',
              left: `${x}%`,
              fontSize: 10,
              fontFamily: 'monospace',
              color: ri === 0 ? primary : secondary,
              opacity: ri === 0 ? 0.9 : 0.3 - ri * 0.05,
            }}
            animate={{ y: ['0%', '110%'] }}
            transition={{
              duration: 3 + ci * 0.8,
              repeat: Infinity,
              delay: ci * 1.2 + ri * 0.3,
              ease: 'linear',
            }}
          >
            {['01','10','11','00','FF','A3','7E'][((ci+ri)*3)%7]}
          </motion.div>
        ))
      )}
      {/* コーナーブラケット */}
      <div style={{
        position: 'absolute',
        [side === 'left' ? 'right' : 'left']: 8,
        top: 16,
        width: 20, height: 20,
        borderTop: `2px solid ${primary}`,
        borderLeft: side === 'left' ? undefined : `2px solid ${primary}`,
        borderRight: side === 'left' ? `2px solid ${primary}` : undefined,
        opacity: 0.5,
      }}/>
      <div style={{
        position: 'absolute',
        [side === 'left' ? 'right' : 'left']: 8,
        bottom: 16,
        width: 20, height: 20,
        borderBottom: `2px solid ${primary}`,
        borderLeft: side === 'left' ? undefined : `2px solid ${primary}`,
        borderRight: side === 'left' ? `2px solid ${primary}` : undefined,
        opacity: 0.5,
      }}/>
    </div>
  )
}

// ---- Matrix: 縦に流れる文字列 ----
function MatrixSide({ primary }: { primary: string }) {
  const chars = '01アイウエオカキ01ク10ケコ'
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[20, 50, 75].map((x, ci) => (
        <motion.div
          key={ci}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 4 + ci, repeat: Infinity, ease: 'linear', delay: ci * 1.5 }}
        >
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} style={{
              fontSize: 11,
              fontFamily: 'monospace',
              color: primary,
              opacity: i === 0 ? 1 : Math.max(0.05, 0.8 - i * 0.08),
              lineHeight: 1.4,
            }}>
              {chars[(ci * 5 + i * 3) % chars.length]}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

// ---- Kawaii: 浮かぶ星と♡ ----
function KawaiiSide({ primary, secondary, accent }: { primary: string; secondary: string; accent: string }) {
  const items = ['★','♡','✦','◆','★','♡','✿']
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[10,35,60,80,20,55,75].map((x, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            fontSize: 12 + (i % 3) * 4,
            color: [primary, secondary, accent][i % 3],
          }}
          animate={{ y: ['100%', '-10%'], rotate: [0, 360], opacity: [0, 0.8, 0] }}
          transition={{ duration: 5 + i * 0.7, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}
        >
          {items[i]}
        </motion.div>
      ))}
    </div>
  )
}

// ---- Lofi: ゆっくり流れる雲と雨 ----
function LofiSide({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 雲 */}
      {[20, 60].map((y, i) => (
        <motion.div key={i} style={{ position: 'absolute', top: `${y}%`, left: 0, opacity: 0.15 }}
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'linear', delay: i * 5 }}
        >
          <svg width="60" height="24" viewBox="0 0 60 24">
            <ellipse cx="30" cy="16" rx="28" ry="10" fill={secondary}/>
            <ellipse cx="20" cy="12" rx="16" ry="10" fill={secondary}/>
            <ellipse cx="40" cy="11" rx="14" ry="9" fill={secondary}/>
          </svg>
        </motion.div>
      ))}
      {/* 雨粒 */}
      {[15,35,55,75,90].map((x, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: `${x}%`, width: 1.5, height: 8, background: primary, borderRadius: 1, opacity: 0.3 }}
          animate={{ y: ['-5%', '105%'], opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

// ---- Sakura: 花びらが舞う ----
function SakuraSide({ primary }: { primary: string }) {
  const petals = [10,25,45,65,80,90,30,70]
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {petals.map((x, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            width: 6 + (i % 3) * 2,
            height: 4 + (i % 3),
            background: primary,
            borderRadius: '50% 0 50% 0',
            opacity: 0.5,
          }}
          animate={{
            y: ['-5%', '105%'],
            x: [0, (i % 2 === 0 ? 1 : -1) * 20],
            rotate: [0, 360],
          }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ---- Forest: 蛍が漂う ----
function ForestSide({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[15,40,65,80,25,55].map((x, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${20 + i * 12}%`,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: i % 2 === 0 ? primary : secondary,
            boxShadow: `0 0 6px ${primary}`,
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            y: [0, -10, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ---- Arctic: 雪が降る ----
function ArcticSide({ primary }: { primary: string }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[10,25,40,60,75,88,15,50,80].map((x, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            color: primary,
            fontSize: 8 + (i % 3) * 4,
            opacity: 0.4,
            lineHeight: 1,
          }}
          animate={{ y: ['-5%', '105%'], x: [0, (i%2===0?8:-8)], rotate: [0, 180] }}
          transition={{ duration: 5 + i * 0.6, repeat: Infinity, delay: i * 0.7, ease: 'linear' }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  )
}

// ---- Ghost: 霧とおばけ ----
function GhostSide({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 小さいおばけ */}
      {[20, 60].map((x, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: `${x}%`, opacity: 0.18 }}
          animate={{ y: ['60%', '20%', '60%'], x: [0, (i%2===0?10:-10), 0] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
        >
          <svg width="30" height="36" viewBox="0 0 30 36">
            <path d="M3 20 Q3 4 15 3 Q27 4 27 20 L27 33 Q22 28 18 33 Q15 28 12 33 Q8 28 3 33 Z"
              fill={primary} stroke={secondary} strokeWidth="1"/>
            <ellipse cx="10" cy="16" rx="3" ry="4" fill={secondary} fillOpacity="0.6"/>
            <ellipse cx="20" cy="16" rx="3" ry="4" fill={secondary} fillOpacity="0.6"/>
          </svg>
        </motion.div>
      ))}
      {/* 霧 */}
      {[0,1,2].map(i => (
        <motion.div key={`fog-${i}`}
          style={{
            position: 'absolute', bottom: `${i*15}%`, left: '-20%',
            width: '140%', height: 20,
            background: `radial-gradient(ellipse, ${primary}18 0%, transparent 70%)`,
          }}
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
        />
      ))}
    </div>
  )
}

// ---- Synthwave: スキャンライン＋星 ----
function SynthwaveSide({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* スキャンライン */}
      <motion.div
        style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${primary}60, transparent)`,
        }}
        animate={{ y: ['-5%', '105%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      {/* 星 */}
      {[10,30,55,70,85,20,65].map((x, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute',
            left: `${x}%`, top: `${5 + i * 13}%`,
            width: 2 + i%2, height: 2 + i%2,
            borderRadius: '50%',
            background: i%2===0 ? primary : secondary,
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>
  )
}

const SIDE_EFFECTS: Record<ThemeId, (colors: { p: string; s: string; a: string; side: 'left'|'right' }) => JSX.Element> = {
  cyber:     ({ p, s, side }) => <CyberSide side={side} primary={p} secondary={s} />,
  matrix:    ({ p }) => <MatrixSide primary={p} />,
  synthwave: ({ p, s }) => <SynthwaveSide primary={p} secondary={s} />,
  ghost:     ({ p, s }) => <GhostSide primary={p} secondary={s} />,
  kawaii:    ({ p, s, a }) => <KawaiiSide primary={p} secondary={s} accent={a} />,
  lofi:      ({ p, s }) => <LofiSide primary={p} secondary={s} />,
  sakura:    ({ p }) => <SakuraSide primary={p} />,
  forest:    ({ p, s }) => <ForestSide primary={p} secondary={s} />,
  arctic:    ({ p }) => <ArcticSide primary={p} />,
}

export function SideEffect({ side }: { side: 'left' | 'right' }) {
  const { themeId, theme } = useThemeStore()
  const t = theme()

  return (
    <motion.div
      key={themeId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ width: '100%', height: '100%' }}
    >
      {SIDE_EFFECTS[themeId]({ p: t.primary, s: t.secondary, a: t.accent, side })}
    </motion.div>
  )
}
