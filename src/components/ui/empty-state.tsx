import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {icon && (
        <div className="mb-4 flex items-center justify-center rounded-2xl bg-white/[0.04] p-4 text-white/20 [&>svg]:h-8 [&>svg]:w-8">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-white/85">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-white/40 leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

EmptyState.displayName = 'EmptyState'
export { EmptyState }
