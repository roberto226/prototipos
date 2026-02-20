'use client'

import { useState, useCallback, type ChangeEvent } from 'react'
import { cn } from '@/lib/cn'

export interface CurrencyInputProps {
  label?: string
  value: number
  onChange: (value: number) => void
  error?: string
  hint?: string
  placeholder?: string
  max?: number
  className?: string
  disabled?: boolean
}

function formatDisplay(value: number): string {
  if (value === 0) return ''
  return value.toLocaleString('en-US')
}

function parseRaw(raw: string): number {
  const cleaned = raw.replace(/[^0-9]/g, '')
  return cleaned ? parseInt(cleaned, 10) : 0
}

export function CurrencyInput({
  label,
  value,
  onChange,
  error,
  hint,
  placeholder = '$0',
  max,
  className,
  disabled,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() => formatDisplay(value))

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const numeric = parseRaw(raw)

      if (max && numeric > max) return

      setDisplayValue(numeric === 0 ? '' : numeric.toLocaleString('en-US'))
      onChange(numeric)
    },
    [onChange, max],
  )

  const handleFocus = useCallback(() => {
    if (value === 0) setDisplayValue('')
  }, [value])

  const handleBlur = useCallback(() => {
    setDisplayValue(formatDisplay(value))
  }, [value])

  const inputId = label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-white/85 select-none">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-white/40 text-sm font-medium">
          $
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder.replace('$', '')}
          className={cn(
            'w-full rounded-xl h-10 text-sm pl-7 pr-3.5',
            'bg-white/[0.05] border border-white/[0.08]',
            'text-white placeholder:text-white/25',
            'transition-colors duration-200',
            'focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10',
            'hover:border-white/[0.14]',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'tabular-nums',
            error && 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10',
          )}
        />
      </div>
      {error && <p className="text-xs text-red-400/90 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-white/25 mt-0.5">{hint}</p>}
    </div>
  )
}
