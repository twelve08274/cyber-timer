import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeId = 'cyber' | 'matrix' | 'synthwave' | 'ghost'

export interface Theme {
  id: ThemeId
  name: string
  emoji: string
  primary: string
  secondary: string
  accent: string
  bg: string
  bg2: string
}

export const THEMES: Record<ThemeId, Theme> = {
  cyber: {
    id: 'cyber',
    name: 'Cyber',
    emoji: '⚡',
    primary: '#00f5ff',
    secondary: '#bf00ff',
    accent: '#ff2d78',
    bg: 'linear-gradient(135deg, #0a0e1a 0%, #0d1530 60%, #160a2a 100%)',
    bg2: 'linear-gradient(145deg, #0d1225, #0a0d1f)',
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix',
    emoji: '🟢',
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#00ff41',
    bg: 'linear-gradient(135deg, #0a0f0a 0%, #0a150a 60%, #050f05 100%)',
    bg2: 'linear-gradient(145deg, #0a120a, #060c06)',
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    emoji: '🌅',
    primary: '#ff6ec7',
    secondary: '#f5c400',
    accent: '#ff2d78',
    bg: 'linear-gradient(135deg, #1a0a1a 0%, #2a0d30 60%, #1a0520 100%)',
    bg2: 'linear-gradient(145deg, #1a0d1a, #120a12)',
  },
  ghost: {
    id: 'ghost',
    name: 'Ghost',
    emoji: '👻',
    primary: '#e8f0ff',
    secondary: '#8899bb',
    accent: '#aabbdd',
    bg: 'linear-gradient(135deg, #0e1015 0%, #111318 60%, #0c0e12 100%)',
    bg2: 'linear-gradient(145deg, #111318, #0c0e12)',
  },
}

interface ThemeState {
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
  theme: () => Theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeId: 'cyber',
      setTheme: (themeId) => set({ themeId }),
      theme: () => THEMES[get().themeId],
    }),
    { name: 'cyber-timer-theme' }
  )
)
