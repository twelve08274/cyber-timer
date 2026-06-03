import { motion } from 'framer-motion'
import { useThemeStore, type ThemeId } from '../../stores/themeStore'

function CyberIllustration({ p, s }: { p: string; s: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 地平線グリッド */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={20 + i*45} y1="75" x2="100" y2="45" stroke={p} strokeWidth="0.5" strokeOpacity="0.3"/>
      ))}
      {[0,1,2].map(i => (
        <line key={i} x1="20" y1={50 + i*10} x2="180" y2={50 + i*10} stroke={p} strokeWidth="0.5" strokeOpacity="0.2"/>
      ))}
      {/* ビル群 */}
      <rect x="15" y="30" width="18" height="45" fill={s} fillOpacity="0.15" stroke={s} strokeWidth="0.8"/>
      <rect x="18" y="35" width="4" height="4" fill={s} fillOpacity="0.6"/>
      <rect x="24" y="35" width="4" height="4" fill={p} fillOpacity="0.8"/>
      <rect x="40" y="20" width="22" height="55" fill={s} fillOpacity="0.12" stroke={s} strokeWidth="0.8"/>
      <rect x="43" y="25" width="4" height="4" fill={p} fillOpacity="0.9"/>
      <rect x="50" y="25" width="4" height="4" fill={s} fillOpacity="0.6"/>
      <rect x="43" y="33" width="4" height="4" fill={s} fillOpacity="0.6"/>
      <rect x="148" y="25" width="22" height="50" fill={s} fillOpacity="0.12" stroke={s} strokeWidth="0.8"/>
      <rect x="151" y="30" width="4" height="4" fill={p} fillOpacity="0.9"/>
      <rect x="158" y="30" width="4" height="4" fill={s} fillOpacity="0.6"/>
      <rect x="168" y="35" width="18" height="40" fill={s} fillOpacity="0.15" stroke={s} strokeWidth="0.8"/>
      {/* 中央の月 */}
      <circle cx="100" cy="22" r="14" fill="none" stroke={p} strokeWidth="1.5" strokeOpacity="0.6"/>
      <circle cx="100" cy="22" r="10" fill={p} fillOpacity="0.08"/>
      <line x1="100" y1="8" x2="100" y2="4" stroke={p} strokeWidth="1" strokeOpacity="0.5"/>
      {/* グロー */}
      <circle cx="100" cy="22" r="18" fill={p} fillOpacity="0.04"/>
    </svg>
  )
}

function MatrixIllustration({ p }: { p: string }) {
  const cols = [20, 45, 70, 95, 120, 145, 170]
  const chars = '01アイウエオカキクケコ'
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'monospace' }}>
      {cols.map((x, ci) =>
        [0,1,2,3,4].map(ri => {
          const opacity = Math.max(0.08, 1 - ri * 0.2) * (ci % 2 === 0 ? 1 : 0.6)
          const char = chars[(ci * 3 + ri * 7) % chars.length]
          return (
            <text key={`${ci}-${ri}`} x={x} y={12 + ri * 16} fontSize="11" fill={p} fillOpacity={opacity} textAnchor="middle">
              {char}
            </text>
          )
        })
      )}
      {/* フェードアウト */}
      <rect x="0" y="50" width="200" height="30" fill="url(#matFade)"/>
      <defs>
        <linearGradient id="matFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020c02" stopOpacity="0"/>
          <stop offset="100%" stopColor="#020c02" stopOpacity="1"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function SynthwaveIllustration({ p, s }: { p: string; s: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 夕日 */}
      <circle cx="100" cy="50" r="28" fill={s} fillOpacity="0.7"/>
      <circle cx="100" cy="50" r="22" fill={s} fillOpacity="0.5"/>
      {/* 地平線 */}
      <line x1="0" y1="50" x2="200" y2="50" stroke={p} strokeWidth="1.5" strokeOpacity="0.8"/>
      {/* グリッドライン（縦） */}
      {[-60,-40,-20,0,20,40,60].map((dx, i) => (
        <line key={i} x1={100+dx} y1="50" x2={100+dx*3} y2="78" stroke={p} strokeWidth="0.6" strokeOpacity="0.4"/>
      ))}
      {/* グリッドライン（横） */}
      {[0,1,2].map(i => (
        <line key={i} x1="0" y1={55+i*8} x2="200" y2={55+i*8} stroke={p} strokeWidth="0.6" strokeOpacity="0.3"/>
      ))}
      {/* 山のシルエット */}
      <path d="M0 50 L35 28 L60 50" fill="#2a0d30" stroke={p} strokeWidth="1" strokeOpacity="0.5"/>
      <path d="M140 50 L165 22 L200 50" fill="#2a0d30" stroke={p} strokeWidth="1" strokeOpacity="0.5"/>
      {/* 星 */}
      {[[30,15],[80,8],[130,12],[170,18]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill={p} fillOpacity="0.7"/>
      ))}
    </svg>
  )
}

function GhostIllustration({ p, s }: { p: string; s: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 霧 */}
      {[0,1,2].map(i => (
        <ellipse key={i} cx={50+i*50} cy={65} rx={30} ry={6} fill={p} fillOpacity={0.04+i*0.02}/>
      ))}
      {/* おばけ本体 */}
      <path d="M85 55 Q85 30 100 28 Q115 30 115 55 L115 68 Q110 63 105 68 Q100 63 95 68 Q90 63 85 68 Z"
        fill={p} fillOpacity="0.15" stroke={p} strokeWidth="1.2" strokeOpacity="0.5"/>
      {/* 目 */}
      <ellipse cx="95" cy="44" rx="3" ry="4" fill={s} fillOpacity="0.8"/>
      <ellipse cx="105" cy="44" rx="3" ry="4" fill={s} fillOpacity="0.8"/>
      {/* 小さいおばけ */}
      <path d="M140 58 Q140 45 148 44 Q156 45 156 58 L156 65 Q153 62 150 65 Q147 62 144 65 Q141 62 140 65 Z"
        fill={p} fillOpacity="0.08" stroke={p} strokeWidth="0.8" strokeOpacity="0.3"/>
      <ellipse cx="145" cy="52" rx="2" ry="2.5" fill={s} fillOpacity="0.5"/>
      <ellipse cx="151" cy="52" rx="2" ry="2.5" fill={s} fillOpacity="0.5"/>
      {/* 星 */}
      {[[25,20],[50,35],[160,25],[175,40]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill={p} fillOpacity="0.5"/>
      ))}
    </svg>
  )
}

function KawaiiIllustration({ p, s, a }: { p: string; s: string; a: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 星と♡ */}
      {[[20,20],[170,15],[40,55],[160,50]].map(([x,y],i) => (
        <text key={i} x={x} y={y} fontSize="10" fill={p} fillOpacity="0.5" textAnchor="middle">
          {i%2===0?'★':'♡'}
        </text>
      ))}
      {/* キャラクター */}
      <circle cx="100" cy="38" r="20" fill={p} fillOpacity="0.15" stroke={p} strokeWidth="1.2"/>
      {/* 顔 */}
      <circle cx="93" cy="35" r="3" fill={s} fillOpacity="0.8"/>
      <circle cx="107" cy="35" r="3" fill={s} fillOpacity="0.8"/>
      <path d="M92 43 Q100 49 108 43" stroke={a} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* ほっぺ */}
      <ellipse cx="88" cy="40" rx="4" ry="2.5" fill={a} fillOpacity="0.3"/>
      <ellipse cx="112" cy="40" rx="4" ry="2.5" fill={a} fillOpacity="0.3"/>
      {/* 耳 */}
      <ellipse cx="81" cy="30" rx="5" ry="7" fill={p} fillOpacity="0.2" stroke={p} strokeWidth="1"/>
      <ellipse cx="119" cy="30" rx="5" ry="7" fill={p} fillOpacity="0.2" stroke={p} strokeWidth="1"/>
      {/* リボン */}
      <path d="M90 18 L100 23 L110 18 L100 15 Z" fill={s} fillOpacity="0.6"/>
      {/* 体 */}
      <path d="M82 58 Q82 52 100 52 Q118 52 118 58 L115 72 Q100 75 85 72 Z"
        fill={p} fillOpacity="0.12" stroke={p} strokeWidth="0.8"/>
    </svg>
  )
}

function LofiIllustration({ p, s }: { p: string; s: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 窓 */}
      <rect x="130" y="10" width="55" height="55" rx="4" fill={p} fillOpacity="0.05" stroke={p} strokeWidth="0.8" strokeOpacity="0.3"/>
      <line x1="157" y1="10" x2="157" y2="65" stroke={p} strokeWidth="0.6" strokeOpacity="0.3"/>
      <line x1="130" y1="37" x2="185" y2="37" stroke={p} strokeWidth="0.6" strokeOpacity="0.3"/>
      {/* 雨 */}
      {[[138,15],[148,22],[165,18],[175,25],[140,30],[170,32]].map(([x,y],i) => (
        <line key={i} x1={x} y1={y} x2={x-2} y2={y+6} stroke={p} strokeWidth="0.8" strokeOpacity="0.4"/>
      ))}
      {/* 机 */}
      <rect x="10" y="58" width="110" height="4" rx="2" fill={s} fillOpacity="0.4"/>
      {/* コーヒーカップ */}
      <path d="M55 40 L55 58 Q55 62 60 62 L70 62 Q75 62 75 58 L75 40 Z" fill={s} fillOpacity="0.2" stroke={s} strokeWidth="1"/>
      <path d="M75 47 Q82 47 82 52 Q82 57 75 57" fill="none" stroke={s} strokeWidth="1" strokeOpacity="0.6"/>
      {/* 湯気 */}
      <path d="M61 38 Q63 33 61 28" fill="none" stroke={p} strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>
      <path d="M68 36 Q70 31 68 26" fill="none" stroke={p} strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>
      {/* 本 */}
      <rect x="20" y="42" width="28" height="16" rx="1" fill={p} fillOpacity="0.15" stroke={p} strokeWidth="0.8"/>
      <line x1="34" y1="42" x2="34" y2="58" stroke={p} strokeWidth="0.5" strokeOpacity="0.4"/>
      {/* ヘッドフォン */}
      <path d="M88 50 Q88 42 96 40 Q104 42 104 50" fill="none" stroke={p} strokeWidth="1.5" strokeOpacity="0.6"/>
      <rect x="85" y="48" width="6" height="8" rx="2" fill={p} fillOpacity="0.3"/>
      <rect x="101" y="48" width="6" height="8" rx="2" fill={p} fillOpacity="0.3"/>
    </svg>
  )
}

function SakuraIllustration({ p, s }: { p: string; s: string }) {
  function petal(cx: number, cy: number, angle: number) {
    const rad = (angle * Math.PI) / 180
    const x = cx + 10 * Math.cos(rad)
    const y = cy + 10 * Math.sin(rad)
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="3" fill="${p}" fill-opacity="0.5" transform="rotate(${angle} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
  }
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 枝 */}
      <path d="M10 80 Q50 60 80 40 Q100 28 130 20" stroke={s} strokeWidth="2" strokeOpacity="0.4" fill="none" strokeLinecap="round"/>
      <path d="M80 40 Q90 50 110 55" stroke={s} strokeWidth="1.5" strokeOpacity="0.3" fill="none"/>
      <path d="M130 20 Q145 30 160 25 Q175 20 185 10" stroke={s} strokeWidth="1.5" strokeOpacity="0.3" fill="none"/>
      {/* 花びら群 */}
      {[
        [70,38],[85,30],[100,24],[115,20],[130,18],[145,25],[160,22],
        [75,48],[95,42],[110,50],
      ].map(([cx,cy],i) => (
        [0,72,144,216,288].map(a => (
          <ellipse key={`${i}-${a}`}
            cx={cx + 8*Math.cos(a*Math.PI/180)}
            cy={cy + 8*Math.sin(a*Math.PI/180)}
            rx="4" ry="2.5"
            fill={p} fillOpacity={0.4 + (i%3)*0.1}
            transform={`rotate(${a} ${cx + 8*Math.cos(a*Math.PI/180)} ${cy + 8*Math.sin(a*Math.PI/180)})`}
          />
        ))
      ))}
      {/* 花中心 */}
      {[[70,38],[100,24],[145,25],[110,50]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill={s} fillOpacity="0.7"/>
      ))}
      {/* 散る花びら */}
      {[[30,30],[50,45],[175,45],[185,60]].map(([cx,cy],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="3" ry="2" fill={p} fillOpacity="0.3" transform={`rotate(${i*30} ${cx} ${cy})`}/>
      ))}
    </svg>
  )
}

function ForestIllustration({ p, s }: { p: string; s: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 月 */}
      <circle cx="160" cy="18" r="12" fill={p} fillOpacity="0.12" stroke={p} strokeWidth="1" strokeOpacity="0.4"/>
      <circle cx="155" cy="15" r="12" fill="#061008"/>
      {/* 遠景の木 */}
      {[[10,50],[30,42],[50,48],[150,45],[170,40],[190,48]].map(([x,y],i) => (
        <g key={i}>
          <polygon points={`${x},${y} ${x-8},${y+18} ${x+8},${y+18}`} fill={s} fillOpacity="0.15"/>
          <polygon points={`${x},${y+8} ${x-10},${y+26} ${x+10},${y+26}`} fill={s} fillOpacity="0.12"/>
        </g>
      ))}
      {/* 近景の木（大） */}
      {[[80,30],[120,25]].map(([x,y],i) => (
        <g key={i}>
          <polygon points={`${x},${y} ${x-14},${y+28} ${x+14},${y+28}`} fill={p} fillOpacity="0.25" stroke={p} strokeWidth="0.5" strokeOpacity="0.3"/>
          <polygon points={`${x},${y+14} ${x-18},${y+42} ${x+18},${y+42}`} fill={p} fillOpacity="0.2" stroke={p} strokeWidth="0.5" strokeOpacity="0.3"/>
          <rect x={x-3} y={y+40} width="6" height="14" fill={s} fillOpacity="0.3"/>
        </g>
      ))}
      {/* 草 */}
      <rect x="0" y="70" width="200" height="10" fill={p} fillOpacity="0.08"/>
      {/* 蛍 */}
      {[[40,55],[100,60],[155,58]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={p} fillOpacity="0.8">
        </circle>
      ))}
    </svg>
  )
}

function ArcticIllustration({ p, s }: { p: string; s: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* オーロラ */}
      <path d="M0 20 Q50 10 100 25 Q150 38 200 15" fill="none" stroke={p} strokeWidth="6" strokeOpacity="0.12"/>
      <path d="M0 28 Q50 18 100 33 Q150 46 200 23" fill="none" stroke={s} strokeWidth="4" strokeOpacity="0.1"/>
      {/* 雪山 */}
      <path d="M0 80 L40 40 L70 60 L100 30 L130 55 L160 38 L200 80 Z" fill={p} fillOpacity="0.08" stroke={p} strokeWidth="0.8" strokeOpacity="0.3"/>
      {/* 雪の頂上 */}
      <path d="M40 40 L30 55 L50 55 Z" fill={p} fillOpacity="0.25"/>
      <path d="M100 30 L88 48 L112 48 Z" fill={p} fillOpacity="0.3"/>
      <path d="M160 38 L150 53 L170 53 Z" fill={p} fillOpacity="0.25"/>
      {/* 雪片 */}
      {[[20,15],[60,22],[140,18],[180,28],[80,10]].map(([x,y],i) => (
        <g key={i}>
          <line x1={x-4} y1={y} x2={x+4} y2={y} stroke={p} strokeWidth="0.8" strokeOpacity="0.6"/>
          <line x1={x} y1={y-4} x2={x} y2={y+4} stroke={p} strokeWidth="0.8" strokeOpacity="0.6"/>
          <line x1={x-3} y1={y-3} x2={x+3} y2={y+3} stroke={p} strokeWidth="0.5" strokeOpacity="0.4"/>
          <line x1={x+3} y1={y-3} x2={x-3} y2={y+3} stroke={p} strokeWidth="0.5" strokeOpacity="0.4"/>
        </g>
      ))}
      {/* 星 */}
      {[[35,8],[95,5],[155,10]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill={s} fillOpacity="0.7"/>
      ))}
    </svg>
  )
}

const ILLUSTRATIONS: Record<ThemeId, (colors: { p: string; s: string; a: string }) => JSX.Element> = {
  cyber:     ({ p, s }) => <CyberIllustration p={p} s={s} />,
  matrix:    ({ p }) => <MatrixIllustration p={p} />,
  synthwave: ({ p, s }) => <SynthwaveIllustration p={p} s={s} />,
  ghost:     ({ p, s }) => <GhostIllustration p={p} s={s} />,
  kawaii:    ({ p, s, a }) => <KawaiiIllustration p={p} s={s} a={a} />,
  lofi:      ({ p, s }) => <LofiIllustration p={p} s={s} />,
  sakura:    ({ p, s }) => <SakuraIllustration p={p} s={s} />,
  forest:    ({ p, s }) => <ForestIllustration p={p} s={s} />,
  arctic:    ({ p, s }) => <ArcticIllustration p={p} s={s} />,
}

export function ThemeIllustration() {
  const { themeId, theme } = useThemeStore()
  const t = theme()

  return (
    <motion.div
      key={themeId}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100%',
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 20,
        border: `1px solid ${t.border}`,
        background: t.bg2,
      }}
    >
      {ILLUSTRATIONS[themeId]({ p: t.primary, s: t.secondary, a: t.accent })}
    </motion.div>
  )
}
