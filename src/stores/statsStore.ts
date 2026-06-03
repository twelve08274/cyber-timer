import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DayStats {
  date: string       // YYYY-MM-DD
  focusSeconds: number
  sessions: number
}

interface StatsState {
  history: DayStats[]
  addFocusTime: (seconds: number) => void
  getTodayStats: () => DayStats
  getWeekStats: () => DayStats[]
  getStreak: () => number
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      history: [],

      addFocusTime: (seconds) => {
        const date = today()
        set((state) => {
          const existing = state.history.find(d => d.date === date)
          if (existing) {
            return {
              history: state.history.map(d =>
                d.date === date
                  ? { ...d, focusSeconds: d.focusSeconds + seconds, sessions: d.sessions + 1 }
                  : d
              ),
            }
          }
          return { history: [...state.history, { date, focusSeconds: seconds, sessions: 1 }] }
        })
      },

      getTodayStats: () => {
        const date = today()
        return get().history.find(d => d.date === date) ?? { date, focusSeconds: 0, sessions: 0 }
      },

      getWeekStats: () => {
        const days: DayStats[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const date = d.toISOString().slice(0, 10)
          days.push(get().history.find(h => h.date === date) ?? { date, focusSeconds: 0, sessions: 0 })
        }
        return days
      },

      getStreak: () => {
        const { history } = get()
        let streak = 0
        const d = new Date()
        while (true) {
          const date = d.toISOString().slice(0, 10)
          if (history.find(h => h.date === date && h.sessions > 0)) {
            streak++
            d.setDate(d.getDate() - 1)
          } else break
        }
        return streak
      },
    }),
    { name: 'cyber-timer-stats' }
  )
)
