import { create } from 'zustand'
import { Howl } from 'howler'

export type BGMTrack = 'lofi' | 'rain' | 'whitenoise' | 'cafe' | 'none'

export const TRACKS: Record<BGMTrack, { label: string; emoji: string }> = {
  lofi:       { label: 'Lo-Fi',         emoji: '🎵' },
  rain:       { label: '雨音',           emoji: '🌧️' },
  whitenoise: { label: 'ホワイトノイズ', emoji: '🌊' },
  cafe:       { label: 'カフェ',         emoji: '☕' },
  none:       { label: 'なし',           emoji: '🔇' },
}

// Pixabay 無料BGM (CC0 / フリー、CORS対応)
const TRACK_URLS: Partial<Record<BGMTrack, string>> = {
  lofi: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
  cafe: 'https://cdn.pixabay.com/audio/2022/10/30/audio_8929b0f527.mp3',
}

// --- Web Audio API: プロシージャル環境音 ---
let audioCtx: AudioContext | null = null
let procNodes: AudioNode[] = []

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext()
    ;(window as Window & { __cyberAudioCtx?: AudioContext }).__cyberAudioCtx = audioCtx
  }
  return audioCtx
}

function stopProcedural() {
  procNodes.forEach(n => { try { n.disconnect() } catch {} })
  procNodes = []
}

function startRain(volume: number) {
  stopProcedural()
  const ctx = getCtx()
  const bufferSize = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  // バンドパスフィルタで雨っぽい音に
  const bpf = ctx.createBiquadFilter()
  bpf.type = 'bandpass'
  bpf.frequency.value = 600
  bpf.Q.value = 0.5

  const lpf = ctx.createBiquadFilter()
  lpf.type = 'lowpass'
  lpf.frequency.value = 2000

  const gain = ctx.createGain()
  gain.gain.value = volume * 0.6

  source.connect(bpf)
  bpf.connect(lpf)
  lpf.connect(gain)
  gain.connect(ctx.destination)
  source.start()

  procNodes = [source, bpf, lpf, gain]
}

function startWhiteNoise(volume: number) {
  stopProcedural()
  const ctx = getCtx()
  const bufferSize = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  const gain = ctx.createGain()
  gain.gain.value = volume * 0.3

  source.connect(gain)
  gain.connect(ctx.destination)
  source.start()

  procNodes = [source, gain]
}

function setProcVolume(volume: number, track: BGMTrack) {
  const gainNode = procNodes.find(n => n instanceof GainNode) as GainNode | undefined
  if (!gainNode) return
  gainNode.gain.value = volume * (track === 'rain' ? 0.6 : 0.3)
}

// --- Howler: 音楽トラック ---
let howl: Howl | null = null

function stopHowl() {
  if (howl) { howl.stop(); howl.unload(); howl = null }
}

function loadHowl(track: BGMTrack, volume: number) {
  stopHowl()
  const url = TRACK_URLS[track]
  if (!url) return
  howl = new Howl({ src: [url], loop: true, volume, html5: true })
  howl.play()
}

// --- Store ---
interface AudioState {
  track: BGMTrack
  volume: number
  playing: boolean
  tracks: typeof TRACKS
  setTrack: (track: BGMTrack) => void
  setVolume: (volume: number) => void
  toggle: () => void
  stop: () => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  track: 'none',
  volume: 0.5,
  playing: false,
  tracks: TRACKS,

  setTrack: (track) => {
    const { volume } = get()
    stopHowl()
    stopProcedural()

    if (track === 'none') {
      set({ track, playing: false })
      return
    }

    if (track === 'rain') {
      startRain(volume)
    } else if (track === 'whitenoise') {
      startWhiteNoise(volume)
    } else {
      loadHowl(track, volume)
    }
    set({ track, playing: true })
  },

  setVolume: (volume) => {
    const { track } = get()
    if (howl) howl.volume(volume)
    if (track === 'rain' || track === 'whitenoise') {
      setProcVolume(volume, track)
    }
    set({ volume })
  },

  toggle: () => {
    const { playing, track, volume } = get()
    if (playing) {
      howl?.pause()
      stopProcedural()
      set({ playing: false })
    } else {
      if (howl) {
        howl.play()
      } else if (track === 'rain') {
        startRain(volume)
      } else if (track === 'whitenoise') {
        startWhiteNoise(volume)
      } else if (track !== 'none') {
        loadHowl(track, volume)
      }
      set({ playing: true })
    }
  },

  stop: () => {
    stopHowl()
    stopProcedural()
    set({ playing: false })
  },
}))
