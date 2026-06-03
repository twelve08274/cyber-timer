import { create } from 'zustand'

export type YTStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

interface YouTubeState {
  videoId: string | null
  videoTitle: string | null
  status: YTStatus
  volume: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any | null

  loadUrl: (url: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPlayer: (player: any) => void
  setStatus: (status: YTStatus) => void
  setTitle: (title: string) => void
  setVolume: (volume: number) => void
  play: () => void
  pause: () => void
  stop: () => void
}

/** YouTube URLから動画IDを抽出 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export const useYouTubeStore = create<YouTubeState>((set, get) => ({
  videoId: null,
  videoTitle: null,
  status: 'idle',
  volume: 50,
  player: null,

  loadUrl: (url) => {
    const videoId = extractVideoId(url)
    if (!videoId) {
      set({ status: 'error', videoTitle: '無効なURLです' })
      setTimeout(() => set({ status: 'idle', videoTitle: null }), 2000)
      return
    }
    set({ videoId, status: 'loading', videoTitle: null })
  },

  setPlayer: (player) => set({ player }),

  setStatus: (status) => set({ status }),

  setTitle: (title) => set({ videoTitle: title }),

  setVolume: (volume) => {
    const { player } = get()
    if (player) player.setVolume(volume)
    set({ volume })
  },

  play: () => {
    const { player } = get()
    if (player) player.playVideo()
    set({ status: 'playing' })
  },

  pause: () => {
    const { player } = get()
    if (player) player.pauseVideo()
    set({ status: 'paused' })
  },

  stop: () => {
    const { player } = get()
    if (player) player.stopVideo()
    set({ status: 'idle', videoId: null, videoTitle: null })
  },
}))
