import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeId = 'cyber' | 'matrix' | 'synthwave' | 'ghost' | 'kawaii' | 'lofi' | 'sakura' | 'forest' | 'arctic'

export interface Theme {
  id: ThemeId
  name: string
  emoji: string
  primary: string
  secondary: string
  accent: string
  bg: string
  bg2: string
  border: string
  textDim: string
  cardBg: string
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
    border: '#1e2d50',
    textDim: '#5a6a8a',
    cardBg: '#111827',
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix',
    emoji: '🟢',
    primary: '#00ff41',
    secondary: '#00aa2a',
    accent: '#39ff14',
    bg: 'linear-gradient(135deg, #020c02 0%, #041004 60%, #020802 100%)',
    bg2: 'linear-gradient(145deg, #051005, #030803)',
    border: '#0a2a0a',
    textDim: '#2a5a2a',
    cardBg: '#031003',
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
    border: '#3a1a40',
    textDim: '#7a4a7a',
    cardBg: '#160a18',
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
    border: '#1e2230',
    textDim: '#4a5570',
    cardBg: '#0e1015',
  },
  kawaii: {
    id: 'kawaii',
    name: 'Kawaii',
    emoji: '🍬',
    primary: '#ff6eb4',
    secondary: '#c084fc',
    accent: '#fb923c',
    bg: 'linear-gradient(135deg, #1a0818 0%, #200a22 60%, #180618 100%)',
    bg2: 'linear-gradient(145deg, #1e0a1e, #160616)',
    border: '#3d1048',
    textDim: '#7a3a7a',
    cardBg: '#1a0820',
  },
  lofi: {
    id: 'lofi',
    name: 'Lo-Fi',
    emoji: '☕',
    primary: '#e8a87c',
    secondary: '#f5c400',
    accent: '#d4845a',
    bg: 'linear-gradient(135deg, #120d08 0%, #1a1008 60%, #140e06 100%)',
    bg2: 'linear-gradient(145deg, #1a1208, #120e06)',
    border: '#2a1e0e',
    textDim: '#5a4a30',
    cardBg: '#160f08',
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura',
    emoji: '🌸',
    primary: '#ffb7c5',
    secondary: '#f9a8d4',
    accent: '#2d5a3d',
    bg: 'linear-gradient(135deg, #0f0810 0%, #160a12 60%, #0d0810 100%)',
    bg2: 'linear-gradient(145deg, #160a12, #0f0810)',
    border: '#2d1525',
    textDim: '#6a3050',
    cardBg: '#120810',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    emoji: '🌿',
    primary: '#4ade80',
    secondary: '#86efac',
    accent: '#16a34a',
    bg: 'linear-gradient(135deg, #061008 0%, #081408 60%, #060e06 100%)',
    bg2: 'linear-gradient(145deg, #081408, #060e06)',
    border: '#0e2a14',
    textDim: '#2a5a30',
    cardBg: '#071008',
  },
  arctic: {
    id: 'arctic',
    name: 'Arctic',
    emoji: '❄️',
    primary: '#e0f2fe',
    secondary: '#7dd3fc',
    accent: '#0ea5e9',
    bg: 'linear-gradient(135deg, #080e14 0%, #0a1220 60%, #06101a 100%)',
    bg2: 'linear-gradient(145deg, #0a1220, #080e14)',
    border: '#0e2030',
    textDim: '#2a4a60',
    cardBg: '#080e16',
  },
}

export const THEME_ORDER: ThemeId[] = ['cyber', 'matrix', 'synthwave', 'ghost', 'kawaii', 'lofi', 'sakura', 'forest', 'arctic']

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
