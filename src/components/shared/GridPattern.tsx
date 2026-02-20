import { cn } from '@/lib/cn'

interface GridPatternProps {
  size?: number
  className?: string
}

export default function GridPattern({ size = 60, className }: GridPatternProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 opacity-[0.03]', className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  )
}
