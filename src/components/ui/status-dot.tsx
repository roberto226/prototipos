import { cn } from '@/lib/cn'

type StatusColor = 'green' | 'red' | 'yellow' | 'blue' | 'gray'

export interface StatusDotProps {
  color?: StatusColor
  customColor?: string
  pulse?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const colorClasses: Record<StatusColor, { dot: string; pulse: string }> = {
  green: { dot: 'bg-emerald-400', pulse: 'bg-emerald-400/40' },
  red: { dot: 'bg-red-400', pulse: 'bg-red-400/40' },
  yellow: { dot: 'bg-amber-400', pulse: 'bg-amber-400/40' },
  blue: { dot: 'bg-sky-400', pulse: 'bg-sky-400/40' },
  gray: { dot: 'bg-white/25', pulse: 'bg-white/10' },
}

const sizeClasses = { sm: 'h-1.5 w-1.5', md: 'h-2 w-2', lg: 'h-2.5 w-2.5' }

function StatusDot({ color = 'gray', customColor, pulse = false, size = 'md', label, className }: StatusDotProps) {
  const colorConfig = colorClasses[color]
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative inline-flex">
        {pulse && (
          <span
            className={cn('absolute inset-0 rounded-full animate-ping', sizeClasses[size], !customColor && colorConfig.pulse)}
            style={customColor ? { backgroundColor: customColor, opacity: 0.4 } : undefined}
          />
        )}
        <span
          className={cn('relative rounded-full', sizeClasses[size], !customColor && colorConfig.dot)}
          style={customColor ? { backgroundColor: customColor } : undefined}
        />
      </span>
      {label && <span className="text-xs text-white/50 font-medium">{label}</span>}
    </span>
  )
}

StatusDot.displayName = 'StatusDot'
export { StatusDot }
