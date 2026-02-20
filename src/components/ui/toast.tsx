'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: string
  variant: ToastVariant
  message: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (params: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>')
  return ctx
}

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: 'border-emerald-500/20 text-emerald-400' },
  error: { icon: XCircle, classes: 'border-red-500/20 text-red-400' },
  info: { icon: Info, classes: 'border-sky-500/20 text-sky-400' },
}

const ease = [0.16, 1, 0.3, 1] as const

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { icon: Icon, classes } = variantConfig[t.variant]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.3, ease }}
      className={cn('pointer-events-auto w-full max-w-sm flex items-start gap-3 rounded-xl border bg-[#111111] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]', classes)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm text-white/85 leading-relaxed">{t.message}</p>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 rounded-md p-1 text-white/30 hover:text-white/60 transition-colors duration-150"
        aria-label="Cerrar"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (params: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).slice(2)
      const duration = params.duration ?? 4000
      setToasts((prev) => [...prev, { ...params, id }])
      if (duration > 0) setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toasts, toast: addToast, dismiss }), [toasts, addToast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.displayName = 'ToastProvider'

export { ToastProvider, useToast }
export type { Toast, ToastVariant, ToastContextValue }
