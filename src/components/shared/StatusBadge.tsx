import { cn } from '@/lib/cn'
import { STATUS_LABELS, STATUS_BG_CLASSES } from '@/lib/constants'
import type { ReferralStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: ReferralStatus
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_BG_CLASSES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
