'use client'

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  selectSize?: 'sm' | 'md' | 'lg'
  placeholder?: string
}

const sizeClasses = {
  sm: 'h-8 text-xs px-3',
  md: 'h-10 text-sm px-3.5',
  lg: 'h-12 text-base px-4',
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, icon, selectSize = 'md', placeholder, className, id, disabled, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-white/85 select-none">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/25 [&>svg]:h-4 [&>svg]:w-4">
              {icon}
            </span>
          )}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-xl',
              'bg-white/[0.05] border border-white/[0.08]',
              'text-white',
              'transition-colors duration-200',
              'focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10',
              'hover:border-white/[0.14]',
              'disabled:cursor-not-allowed disabled:opacity-40',
              'pr-10',
              sizeClasses[selectSize],
              icon && 'pl-9',
              error && 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-white/25 bg-[#111111]">
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/25">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
        {error && <p className="text-xs text-red-400/90 mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-white/25 mt-0.5">{hint}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
export { Select }
