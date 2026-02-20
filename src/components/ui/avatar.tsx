import { cn } from '@/lib/cn'

type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  name?: string
  src?: string | null
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function nameToHue(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = name ? getInitials(name) : '?'
  const hue = name ? nameToHue(name) : 200

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={cn('inline-flex shrink-0 rounded-full object-cover ring-1 ring-white/[0.08]', sizeClasses[size], className)}
      />
    )
  }

  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none ring-1 ring-white/[0.08]', sizeClasses[size], className)}
      style={{ backgroundColor: `hsl(${hue}, 35%, 18%)`, color: `hsl(${hue}, 50%, 70%)` }}
      role="img"
      aria-label={name ?? 'Avatar'}
    >
      {initials}
    </span>
  )
}

Avatar.displayName = 'Avatar'
export { Avatar }
