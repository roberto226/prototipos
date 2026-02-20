import { useState, useEffect, useCallback } from 'react'

/**
 * Hook that simulates real-time data by subtly fluctuating a number value.
 * Updates every 5-10 seconds with a +/-1-3% variation.
 *
 * Must be used inside a client component ('use client').
 */
export function useMockRealtime(initialValue: number): number {
  const [value, setValue] = useState(initialValue)

  const fluctuate = useCallback(() => {
    setValue((prev) => {
      // Random fluctuation between -3% and +3%
      const percent = (Math.random() * 6 - 3) / 100
      const next = prev + prev * percent
      // Round to 2 decimal places to avoid floating point drift
      return Math.round(next * 100) / 100
    })
  }, [])

  useEffect(() => {
    const scheduleNext = () => {
      // Random interval between 5000ms and 10000ms
      const delay = 5000 + Math.random() * 5000
      return window.setTimeout(() => {
        fluctuate()
        timerRef = scheduleNext()
      }, delay)
    }

    let timerRef = scheduleNext()

    return () => {
      window.clearTimeout(timerRef)
    }
  }, [fluctuate])

  // Reset when initialValue changes significantly
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return value
}
