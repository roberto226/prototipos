'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  trailing?: ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 text-xs px-3',
  md: 'h-10 text-sm px-3.5',
  lg: 'h-12 text-base px-4',
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, trailing, inputSize = 'md', className, id, disabled, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-white/85 select-none">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/25 [&>svg]:h-4 [&>svg]:w-4">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full rounded-xl',
              'bg-white/[0.05] border border-white/[0.08]',
              'text-white placeholder:text-white/25',
              'transition-colors duration-200',
              'focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10',
              'hover:border-white/[0.14]',
              'disabled:cursor-not-allowed disabled:opacity-40',
              sizeClasses[inputSize],
              icon && 'pl-9',
              trailing && 'pr-9',
              error && 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10',
              className,
            )}
            {...props}
          />
          {trailing && (
            <span className="absolute inset-y-0 right-3 flex items-center text-white/25 [&>svg]:h-4 [&>svg]:w-4">
              {trailing}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400/90 mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-white/25 mt-0.5">{hint}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
export { Input }
