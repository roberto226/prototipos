'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'relative isolate text-white font-medium',
    'bg-gradient-to-r from-[#64748B] via-[#94A3B8] to-[#CBD5E1]',
    'before:absolute before:inset-[1px] before:rounded-[inherit] before:bg-[#111111]',
    'before:-z-10',
    'hover:before:bg-[#1a1a1a] active:before:bg-[#0e0e0e]',
    'transition-all duration-200',
    'shadow-[0_0_16px_rgba(148,163,184,0.1)]',
    'hover:shadow-[0_0_24px_rgba(148,163,184,0.18)]',
  ].join(' '),
  secondary: [
    'text-white/85 bg-transparent',
    'border border-white/[0.08] hover:border-white/[0.14]',
    'hover:bg-white/[0.04] active:bg-white/[0.06]',
    'transition-all duration-200',
  ].join(' '),
  danger: [
    'text-white font-medium',
    'bg-red-500/10 border border-red-500/20',
    'hover:bg-red-500/15 hover:border-red-500/30',
    'active:bg-red-500/20',
    'transition-all duration-200',
  ].join(' '),
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon, disabled, className, children, ...props }, ref) => {
    const isDisabled = disabled || loading
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium select-none whitespace-nowrap',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]',
          'disabled:pointer-events-none disabled:opacity-40',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : icon ? (
          <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        ) : null}
        <span className="relative z-10">{children}</span>
      </button>
    )
  },
)

Button.displayName = 'Button'
export { Button }
