'use client'
import { useState, useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  text: string
  speed?: number       // ms per character
  delay?: number       // ms before starting
  enabled?: boolean    // if false, returns full text immediately
  onDone?: () => void
}

export function useTypewriter({
  text,
  speed = 45,
  delay = 0,
  enabled = true,
  onDone,
}: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text)
  const [isDone, setIsDone] = useState(!enabled)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text)
      setIsDone(true)
      return
    }

    setDisplayed('')
    setIsDone(false)
    indexRef.current = 0

    const startTimeout = setTimeout(() => {
      const tick = () => {
        indexRef.current++
        setDisplayed(text.slice(0, indexRef.current))
        if (indexRef.current < text.length) {
          timerRef.current = setTimeout(tick, speed)
        } else {
          setIsDone(true)
          onDone?.()
        }
      }
      timerRef.current = setTimeout(tick, speed)
    }, delay)

    return () => {
      clearTimeout(startTimeout)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, speed, delay, enabled])

  return { displayed, isDone }
}
