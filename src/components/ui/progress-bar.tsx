'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface ProgressBarProps {
  value: number
  color?: string
  gradient?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showValue?: boolean
  className?: string
}

const sizeClasses = { sm: 'h-1', md: 'h-2', lg: 'h-3' }
const ease = [0.16, 1, 0.3, 1] as const

function ProgressBar({ value, color = '#34C759', gradient = false, size = 'md', label, showValue = false, className }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const fillStyle: React.CSSProperties = gradient
    ? { background: 'linear-gradient(90deg, #64748B, #94A3B8, #CBD5E1)' }
    : { backgroundColor: color }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-medium text-white/50">{label}</span>}
          {showValue && <span className="text-xs font-medium text-white/85 tabular-nums">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-white/[0.06]', sizeClasses[size])}>
        <motion.div
          className="h-full rounded-full"
          style={fillStyle}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease }}
        />
      </div>
    </div>
  )
}

ProgressBar.displayName = 'ProgressBar'
export { ProgressBar }
