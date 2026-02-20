'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface Column<T> {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render: (row: T, index: number) => ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T, index: number) => string | number
  onRowClick?: (row: T, index: number) => void
  emptyMessage?: string
  className?: string
  loading?: boolean
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

function DataTable<T>({ columns, data, rowKey, onRowClick, emptyMessage = 'Sin datos', className, loading = false }: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#111111]', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map((col) => (
              <th key={col.key} className={cn('px-5 py-3 text-xs font-medium text-white/50 uppercase tracking-wider', alignClasses[col.align ?? 'left'], col.width)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="border-b border-white/[0.04]">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.04]" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center text-white/25">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={rowKey(row, index)}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                className={cn(
                  'border-b border-white/[0.04] last:border-b-0',
                  'transition-colors duration-150',
                  'hover:bg-white/[0.03]',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-5 py-3.5 text-white/85', alignClasses[col.align ?? 'left'], col.width)}>
                    {col.render(row, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

DataTable.displayName = 'DataTable'
export { DataTable }
