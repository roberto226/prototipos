import { useEffect } from 'react'
import { useMotionValue, useTransform, animate } from 'framer-motion'

interface UseAnimatedNumberOptions {
  duration?: number
  decimals?: number
}

export function useAnimatedNumber(
  target: number,
  trigger: boolean = true,
  options: UseAnimatedNumberOptions = {}
) {
  const { duration = 1.5, decimals = 0 } = options

  const motionValue = useMotionValue(0)

  const display = useTransform(motionValue, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals)
    }
    return Math.round(latest).toLocaleString()
  })

  useEffect(() => {
    if (!trigger) return

    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })

    return () => controls.stop()
  }, [trigger, target, duration, motionValue])

  return { motionValue, display }
}
