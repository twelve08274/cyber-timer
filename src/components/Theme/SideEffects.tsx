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
            animate={{ y: ['10%', '110%'] }}
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
          animate={{ y: ['0%', '120%'] }}
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

// ---- Kawaii: ポップなキャラとキラキラ ----
function KawaiiSide({ side }: { side: 'left'|'right' }) {
  const PINK = '#ff6eb4'
  const CYAN = '#00f0ff'
  const YEL  = '#ffe066'
  const PUR  = '#c084fc'

  // きらきらパーティクル (★ ♡ ✦ ◎)
  const sparks = [
    { x:15, sym:'★', c:CYAN,  size:14, dur:3.2, delay:0   },
    { x:50, sym:'♡', c:PINK,  size:18, dur:2.8, delay:0.6 },
    { x:80, sym:'✦', c:YEL,   size:11, dur:3.6, delay:1.2 },
    { x:30, sym:'♡', c:PUR,   size:13, dur:4.0, delay:0.3 },
    { x:70, sym:'★', c:PINK,  size:10, dur:3.0, delay:1.8 },
    { x:55, sym:'◎', c:CYAN,  size:12, dur:2.6, delay:2.2 },
    { x:10, sym:'✦', c:YEL,   size:9,  dur:3.8, delay:0.9 },
    { x:88, sym:'♡', c:PUR,   size:15, dur:3.4, delay:1.5 },
  ]

  // キャラクターはサイドに1体ずつ (左右で向き変える)
  const flip = side === 'right' ? 'scaleX(-1)' : undefined

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden' }}>

      {/* ── きらきら ── */}
      {sparks.map((s, i) => (
        <motion.div key={i}
          style={{ position:'absolute', left:`${s.x}%`, top:'15%', fontSize:s.size, color:s.c, lineHeight:1, userSelect:'none' }}
          animate={{ y:['0%','80%'], opacity:[0, 1, 1, 0], scale:[0.6,1.2,1,0.8], rotate:[0,20,-20,0] }}
          transition={{ duration:s.dur, repeat:Infinity, delay:s.delay, ease:'easeInOut' }}
        >
          {s.sym}
        </motion.div>
      ))}

      {/* ── キャラクター本体 (SVG) ── */}
      <motion.div
        style={{ position:'absolute', bottom:'12%', left:'50%', marginLeft:-36, transform:flip }}
        animate={{ y:[0,-8,0] }}
        transition={{ duration:2.4, repeat:Infinity, ease:'easeInOut' }}
      >
        <svg width="72" height="88" viewBox="0 0 72 88" fill="none">
          {/* 耳 */}
          <ellipse cx="18" cy="26" rx="8" ry="11" fill={PINK} opacity="0.9"/>
          <ellipse cx="18" cy="26" rx="5" ry="7"  fill="#fff" opacity="0.6"/>
          <ellipse cx="54" cy="26" rx="8" ry="11" fill={PINK} opacity="0.9"/>
          <ellipse cx="54" cy="26" rx="5" ry="7"  fill="#fff" opacity="0.6"/>
          {/* 顔 */}
          <circle cx="36" cy="36" r="24" fill={PINK} opacity="0.95"/>
          <circle cx="36" cy="36" r="24" fill="url(#kFaceGrad)" opacity="0.3"/>
          {/* 目 */}
          <ellipse cx="27" cy="33" rx="5" ry="6" fill={CYAN}/>
          <ellipse cx="45" cy="33" rx="5" ry="6" fill={CYAN}/>
          <ellipse cx="28" cy="32" rx="2" ry="3" fill="#fff" opacity="0.7"/>
          <ellipse cx="46" cy="32" rx="2" ry="3" fill="#fff" opacity="0.7"/>
          <circle  cx="27" cy="34" r="2" fill="#1a0020"/>
          <circle  cx="45" cy="34" r="2" fill="#1a0020"/>
          {/* ほっぺ */}
          <ellipse cx="21" cy="40" rx="6" ry="4" fill="#ff9fce" opacity="0.5"/>
          <ellipse cx="51" cy="40" rx="6" ry="4" fill="#ff9fce" opacity="0.5"/>
          {/* 口 */}
          <path d="M29 44 Q36 50 43 44" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/>
          {/* リボン */}
          <path d="M24 14 L36 20 L48 14 L36 10 Z" fill={CYAN} opacity="0.9"/>
          <circle cx="36" cy="17" r="3" fill="#fff" opacity="0.8"/>
          {/* 体 */}
          <path d="M14 60 Q14 54 36 54 Q58 54 58 60 L54 86 Q36 90 18 86 Z" fill={PUR} opacity="0.85"/>
          {/* 胸のハート */}
          <path d="M32 66 Q32 62 36 64 Q40 62 40 66 Q40 70 36 74 Q32 70 32 66 Z" fill={PINK} opacity="0.7"/>
          <defs>
            <radialGradient id="kFaceGrad" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4"/>
              <stop offset="100%" stopColor={PINK} stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* ── 足元のポップな丸 ── */}
      {[20,50,80].map((x,i) => (
        <motion.div key={`dot-${i}`}
          style={{
            position:'absolute', bottom:'6%', left:`${x}%`,
            width:8+i*3, height:8+i*3, borderRadius:'50%',
            background:[CYAN,PINK,YEL][i], opacity:0.5,
          }}
          animate={{ scale:[1,1.4,1], opacity:[0.3,0.7,0.3] }}
          transition={{ duration:1.5+i*0.4, repeat:Infinity, delay:i*0.5 }}
        />
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
          animate={{ y: ['10%', '105%'], opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

// ---- Sakura: 横枝＋垂れ下がる小枝＋密な花の塊 ----
function SakuraSide({ primary, secondary, side }: { primary: string; secondary: string; side: 'left'|'right' }) {
  const R = side === 'right'

  // 花クラスター描画ヘルパー（中心cx,cy・半径r・密度）
  function flowerCluster(cx: number, cy: number, r: number, op = 0.65) {
    const offsets = [
      [0,0,r*0.55],[r*0.5,-r*0.3,r*0.45],[- r*0.5,-r*0.2,r*0.4],
      [r*0.3,r*0.5,r*0.4],[-r*0.4,r*0.4,r*0.38],[r*0.7,r*0.2,r*0.35],
      [-r*0.6,r*0.1,r*0.32],[r*0.1,-r*0.6,r*0.38],[-r*0.2,r*0.7,r*0.3],
    ]
    return offsets.map(([dx,dy,pr], i) => (
      <circle key={i} cx={cx+dx} cy={cy+dy} r={pr}
        fill={primary} opacity={op - i*0.03} />
    ))
  }

  // 垂れ枝の定義（メイン枝上の起点 sx,sy → 先端 ex,ey）
  const hangBranches = R ? [
    { sx:15,sy:12, ex:10,ey:38, clusters:[{cx:8, cy:44,r:9},{cx:16,cy:52,r:7}] },
    { sx:35,sy:10, ex:28,ey:42, clusters:[{cx:24,cy:48,r:10},{cx:34,cy:56,r:8},{cx:18,cy:58,r:7}] },
    { sx:55,sy:12, ex:50,ey:50, clusters:[{cx:46,cy:56,r:9},{cx:58,cy:62,r:8},{cx:40,cy:64,r:6}] },
    { sx:75,sy:15, ex:70,ey:55, clusters:[{cx:66,cy:60,r:8},{cx:76,cy:66,r:7}] },
  ] : [
    { sx:85,sy:12, ex:90,ey:38, clusters:[{cx:92,cy:44,r:9},{cx:84,cy:52,r:7}] },
    { sx:65,sy:10, ex:72,ey:42, clusters:[{cx:76,cy:48,r:10},{cx:66,cy:56,r:8},{cx:82,cy:58,r:7}] },
    { sx:45,sy:12, ex:50,ey:50, clusters:[{cx:54,cy:56,r:9},{cx:42,cy:62,r:8},{cx:60,cy:64,r:6}] },
    { sx:25,sy:15, ex:30,ey:55, clusters:[{cx:34,cy:60,r:8},{cx:24,cy:66,r:7}] },
  ]

  // 落下花びら（各クラスターの中心から）
  const petals = hangBranches.flatMap((b, bi) =>
    b.clusters.flatMap((c, ci) => [
      { x: c.cx, y: c.cy + c.r * 0.8, dx: R ? 8+ci*5 : -8-ci*5, dur: 4+bi*0.5+ci*0.4, delay: bi*0.8+ci*1.2 },
      { x: c.cx, y: c.cy + c.r * 0.5, dx: R ? -5-bi  :  5+bi,   dur: 3.6+bi*0.4,       delay: bi*0.8+ci*1.2+2 },
    ])
  )

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden' }}>
      <svg style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }}
        viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet">

        {/* メイン横枝 */}
        <path
          d={ R
            ? `M 105 18 Q 70 14 45 12 Q 20 10 -5 8`
            : `M -5 18 Q 30 14 55 12 Q 80 10 105 8`
          }
          stroke={secondary} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.55"/>

        {/* 垂れ枝＋クラスター */}
        {hangBranches.map((b, i) => (
          <g key={i}>
            {/* 垂れ枝本体 */}
            <path d={`M${b.sx} ${b.sy} Q${b.sx+(R?-4:4)} ${(b.sy+b.ey)/2} ${b.ex} ${b.ey}`}
              stroke={secondary} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"/>
            {/* クラスターへの細枝 */}
            {b.clusters.map((c, ci) => (
              <path key={ci}
                d={`M${b.ex} ${b.ey} Q${(b.ex+c.cx)/2} ${(b.ey+c.cy)/2-3} ${c.cx} ${c.cy}`}
                stroke={secondary} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35"/>
            ))}
            {/* 花クラスター */}
            {b.clusters.map((c, ci) => (
              <g key={`fl-${ci}`}>{flowerCluster(c.cx, c.cy, c.r)}</g>
            ))}
          </g>
        ))}
      </svg>

      {/* 落下花びら */}
      {petals.map((p, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width: 6, height: 5,
            background: primary,
            borderRadius: '60% 0 60% 0',
            opacity: 0.8,
          }}
          animate={{
            y: ['0px', '320px'],
            x: [0, p.dx * 10, p.dx * 5],
            rotate: [0, (i%2===0?1:-1) * 260],
            opacity: [0.8, 0.5, 0],
          }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeIn' }}
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
          animate={{ y: ['10%', '105%'], x: [0, (i%2===0?8:-8)], rotate: [0, 180] }}
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
        animate={{ y: ['10%', '105%'] }}
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
  kawaii:    ({ side }) => <KawaiiSide side={side} />,
  lofi:      ({ p, s }) => <LofiSide primary={p} secondary={s} />,
  sakura:    ({ p, s, side }) => <SakuraSide primary={p} secondary={s} side={side} />,
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
