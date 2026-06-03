import { useEffect, useRef } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useStatsStore } from '../stores/statsStore'
import { playFocusComplete, playBreakEnd } from './useSound'
import { useCompletionEffect } from '../components/Effects/CompletionEffect'
import type { TimerMode } from '../stores/timerStore'
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'

async function notify(title: string, body: string) {
  try {
    let granted = await isPermissionGranted()
    if (!granted) {
      const perm = await requestPermission()
      granted = perm === 'granted'
    }
    if (granted) sendNotification({ title, body })
  } catch {
    // ブラウザ環境などTauri外では無視
  }
}

// 完了エフェクトの状態をグローバルに持つ（App.tsxから参照できるよう export）
export type CompletionState = { show: boolean; mode: TimerMode }
let _setCompletion: ((s: CompletionState) => void) | null = null
export function registerCompletionSetter(fn: (s: CompletionState) => void) {
  _setCompletion = fn
}

export function useTimer() {
  const { status, tick, mode } = useTimerStore()
  const { addFocusTime } = useStatsStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevMode = useRef(mode)
  const { fire } = useCompletionEffect()

  useEffect(() => {
    // フォーカス完了 → ブレイク開始
    if (prevMode.current === 'focus' && mode !== 'focus') {
      const { focusDuration, session } = useTimerStore.getState()
      addFocusTime(focusDuration * 60)
      playFocusComplete()
      fire('focus')
      _setCompletion?.({ show: true, mode: 'focus' })
      setTimeout(() => _setCompletion?.({ show: false, mode: 'focus' }), 2000)
      const breakLabel = mode === 'longBreak' ? '長め休憩' : '休憩'
      notify('⏱ フォーカス完了！', `セッション ${session} 終了 — ${breakLabel}タイムです`)
    }
    // ブレイク完了 → フォーカス開始
    if ((prevMode.current === 'break' || prevMode.current === 'longBreak') && mode === 'focus') {
      playBreakEnd()
      fire(prevMode.current)
      _setCompletion?.({ show: true, mode: prevMode.current })
      setTimeout(() => _setCompletion?.({ show: false, mode: prevMode.current }), 2000)
      notify('☕ 休憩終了！', 'さあ、次のフォーカスセッションを始めましょう')
    }
    prevMode.current = mode
  }, [mode, addFocusTime])

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [status, tick])
}
