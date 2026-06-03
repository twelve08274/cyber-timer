import { useEffect, useRef } from 'react'
import { useAudioStore } from '../../stores/audioStore'

export function AudioVisualizer() {
  const { playing, track } = useAudioStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    if (!playing || track === 'none') {
      cancelAnimationFrame(animRef.current)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
      analyserRef.current = null
      return
    }

    // Web Audio APIのグローバルコンテキストに接続
    const win = window as Window & { __cyberAudioCtx?: AudioContext }
    const audioCtx = win.__cyberAudioCtx
    if (!audioCtx) return

    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 64
    analyserRef.current = analyser

    // destination手前に差し込む（既存ノードには接続しない、ただ聴くだけ）
    try {
      audioCtx.destination.connect(analyser)
    } catch {}

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barCount = 20
      const barWidth = (canvas.width - (barCount - 1) * 2) / barCount
      const step = Math.floor(bufferLength / barCount)

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] / 255
        const barHeight = Math.max(2, value * canvas.height)
        const x = i * (barWidth + 2)
        const y = canvas.height - barHeight

        const alpha = 0.4 + value * 0.6
        ctx.fillStyle = `rgba(0, 245, 255, ${alpha})`
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 2)
        ctx.fill()
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      try { audioCtx.destination.disconnect(analyser) } catch {}
    }
  }, [playing, track])

  if (!playing || track === 'none') return null

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={24}
      style={{ display: 'block', margin: '8px auto 0', opacity: 0.7 }}
    />
  )
}
