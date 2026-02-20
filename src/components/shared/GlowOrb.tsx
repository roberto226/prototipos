'use client'

import { cn } from '@/lib/cn'

interface GlowOrbProps {
  color?: string
  size?: number
  position?: {
    top?: string
    left?: string
    right?: string
    bottom?: string
  }
  delay?: number
  className?: string
}

export default function GlowOrb({
  color = '#2DD4BF',
  size = 400,
  position = {},
  delay = 0,
  className,
}: GlowOrbProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute rounded-full blur-[120px] opacity-20',
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        top: position.top,
        left: position.left,
        right: position.right,
        bottom: position.bottom,
        animation: `pulse-glow 6s ease-in-out ${delay}s infinite`,
      }}
    />
  )
}
