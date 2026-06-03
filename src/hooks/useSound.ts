/**
 * Web Audio API でチャイム/通知音を生成するフック
 * 外部ファイル不要・ブラウザ内で完結
 */

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx || ctx.state === 'closed') ctx = new AudioContext()
  return ctx
}

/** 単音を鳴らす（周波数・長さ・音量を指定） */
function playTone(
  frequency: number,
  duration: number,
  volume: number = 0.3,
  type: OscillatorType = 'sine',
  startTime: number = 0,
) {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()

  osc.type = type
  osc.frequency.value = frequency

  // エンベロープ（アタック→サステイン→フェードアウト）
  const t = c.currentTime + startTime
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.02)
  gain.gain.setValueAtTime(volume, t + duration * 0.6)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)

  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t)
  osc.stop(t + duration)
}

/** フォーカスセッション完了チャイム（3音・上昇） */
export function playFocusComplete() {
  playTone(523.25, 0.4, 0.25, 'sine', 0.0)   // C5
  playTone(659.25, 0.4, 0.25, 'sine', 0.15)  // E5
  playTone(783.99, 0.6, 0.3,  'sine', 0.30)  // G5
}

/** ブレイク終了チャイム（2音・柔らか） */
export function playBreakEnd() {
  playTone(659.25, 0.5, 0.2, 'sine', 0.0)   // E5
  playTone(523.25, 0.6, 0.2, 'sine', 0.2)   // C5
}

/** タイマー開始の短いビープ */
export function playStart() {
  playTone(880, 0.12, 0.15, 'sine', 0.0)
}

/** タイマーリセットの低いビープ */
export function playReset() {
  playTone(330, 0.15, 0.1, 'sine', 0.0)
}
