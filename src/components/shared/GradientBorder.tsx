'use client'

import { cn } from '@/lib/cn'

interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  rounded?: string
}

export default function GradientBorder({
  children,
  className,
  rounded = 'rounded-2xl',
}: GradientBorderProps) {
  return (
    <div className={cn('relative p-px', rounded, className)}>
      {/* Spinning gradient border */}
      <div
        className={cn(
          'gradient-border-spin absolute inset-0',
          rounded,
          'bg-[conic-gradient(from_var(--angle),#64748B,#94A3B8,#CBD5E1,#94A3B8,#64748B)]'
        )}
        style={{ '--angle': '0deg' } as React.CSSProperties}
      />

      {/* Inner content container */}
      <div className={cn('relative z-10 bg-zinc-950', rounded)}>
        {children}
      </div>
    </div>
  )
}
