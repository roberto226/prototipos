'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}

const trackSizes = { sm: 'w-8 h-[18px]', md: 'w-11 h-6' }
const thumbSizes = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5' }
const thumbTranslate = { sm: 'translate-x-[14px]', md: 'translate-x-5' }

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, label, size = 'md', disabled, className, ...props }, ref) => {
    return (
      <div className={cn('inline-flex items-center gap-2.5', className)}>
        <button
          ref={ref}
          role="switch"
          type="button"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            'relative inline-flex shrink-0 items-center rounded-full',
            'transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]',
            'disabled:cursor-not-allowed disabled:opacity-40',
            trackSizes[size],
            checked ? 'bg-[#34C759]' : 'bg-white/[0.1]',
          )}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none inline-block rounded-full bg-white shadow-sm',
              'transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'ml-0.5',
              thumbSizes[size],
              checked ? thumbTranslate[size] : 'translate-x-0',
            )}
          />
        </button>
        {label && (
          <span className={cn('text-sm select-none', disabled ? 'text-white/25' : 'text-white/85')}>
            {label}
          </span>
        )}
      </div>
    )
  },
)

Toggle.displayName = 'Toggle'
export { Toggle }
