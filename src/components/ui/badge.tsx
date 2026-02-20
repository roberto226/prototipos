import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'vip' | 'standard'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-white/[0.06] text-white/85 border-white/[0.08]',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  vip: [
    'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-400/10',
    'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400',
    'border-amber-500/20',
  ].join(' '),
  standard: 'bg-white/[0.04] text-white/50 border-white/[0.06]',
}

function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5',
        'text-[11px] font-medium leading-none select-none whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'
export { Badge }
