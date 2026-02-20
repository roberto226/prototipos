import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  padding?: CardPadding
  as?: React.ElementType
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, padding = 'md', as: Component = 'div', className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-2xl bg-[#111111] border border-white/[0.06]',
          paddingClasses[padding],
          hoverable && [
            'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'hover:border-white/[0.14]',
            'hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
            'hover:-translate-y-0.5',
          ],
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    )
  },
)

Card.displayName = 'Card'

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between pb-4 border-b border-white/[0.04]', className)} {...props}>
      {children}
    </div>
  )
}
CardHeader.displayName = 'CardHeader'

function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-semibold text-white/85', className)} {...props}>
      {children}
    </h3>
  )
}
CardTitle.displayName = 'CardTitle'

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-4', className)} {...props}>
      {children}
    </div>
  )
}
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }
