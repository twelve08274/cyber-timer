import { useEffect } from 'react'
import { useTimerStore } from '../stores/timerStore'

export function useKeyboard() {
  const { status, start, pause, reset, skip } = useTimerStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          status === 'running' ? pause() : start()
          break
        case 'KeyR':
          reset()
          break
        case 'KeyS':
          skip()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [status, start, pause, reset, skip])
}
