'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface StatCardProps {
  label: string
  value: string | number
  trend?: { direction: 'up' | 'down'; value: number }
  icon?: ReactNode
  className?: string
  index?: number
}

const ease = [0.16, 1, 0.3, 1] as const

function StatCard({ label, value, trend, icon, className, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: index * 0.08 }}
      className={cn('rounded-2xl bg-[#111111] border border-white/[0.06] p-4 sm:p-6 flex flex-col gap-3', className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/50 font-medium">{label}</span>
        {icon && <span className="text-white/20 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>}
      </div>
      <div className="flex items-end gap-3">
        <motion.span
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease, delay: index * 0.08 + 0.15 }}
          className="text-2xl font-bold text-white tracking-tight"
        >
          {value}
        </motion.span>
        {trend && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease, delay: index * 0.08 + 0.25 }}
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium pb-0.5',
              trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400',
            )}
          >
            {trend.direction === 'up' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {trend.value}%
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

StatCard.displayName = 'StatCard'
export { StatCard }
