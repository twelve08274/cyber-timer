import { create } from 'zustand'

export type TimerMode = 'focus' | 'break' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused'
export type TimerType = 'pomodoro' | 'custom'

interface TimerState {
  mode: TimerMode
  status: TimerStatus
  type: TimerType
  remaining: number       // seconds
  total: number           // seconds
  session: number         // current session (1-4)
  focusDuration: number   // minutes
  breakDuration: number   // minutes
  longBreakDuration: number

  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  tick: () => void
  setType: (type: TimerType) => void
  setFocusDuration: (min: number) => void
}

const FOCUS = 25 * 60
export const BREAK = 5 * 60
export const LONG_BREAK = 15 * 60

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'focus',
  status: 'idle',
  type: 'pomodoro',
  remaining: FOCUS,
  total: FOCUS,
  session: 1,
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,

  start: () => set({ status: 'running' }),
  pause: () => set({ status: 'paused' }),

  reset: () => {
    const { focusDuration } = get()
    const secs = focusDuration * 60
    set({ status: 'idle', mode: 'focus', remaining: secs, total: secs, session: 1 })
  },

  skip: () => {
    const { mode, session, breakDuration, longBreakDuration, focusDuration } = get()
    if (mode === 'focus') {
      const nextSession = session + 1
      const isLong = nextSession > 4
      const nextMode: TimerMode = isLong ? 'longBreak' : 'break'
      const dur = isLong ? longBreakDuration * 60 : breakDuration * 60
      set({ mode: nextMode, remaining: dur, total: dur, session: isLong ? 1 : nextSession, status: 'idle' })
    } else {
      const dur = focusDuration * 60
      set({ mode: 'focus', remaining: dur, total: dur, status: 'idle' })
    }
  },

  tick: () => {
    const { remaining, skip } = get()
    if (remaining <= 1) {
      skip()
    } else {
      set({ remaining: remaining - 1 })
    }
  },

  setType: (type) => {
    const { focusDuration } = get()
    const secs = focusDuration * 60
    set({ type, status: 'idle', remaining: secs, total: secs, mode: 'focus', session: 1 })
  },

  setFocusDuration: (min) => {
    const secs = min * 60
    set({ focusDuration: min, remaining: secs, total: secs, status: 'idle' })
  },
}))
