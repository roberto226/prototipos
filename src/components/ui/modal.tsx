'use client'

import { type ReactNode, type MouseEvent, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidth?: string
  className?: string
  persistent?: boolean
}

const ease = [0.16, 1, 0.3, 1] as const

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
}

function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg', className, persistent = false }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  const handleBackdropClick = useCallback(
    (e: MouseEvent) => {
      if (e.target === e.currentTarget && !persistent) onClose()
    },
    [onClose, persistent],
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease }}
            className={cn(
              'relative w-full',
              maxWidth,
              'rounded-2xl bg-[#111111] border border-white/[0.06]',
              'shadow-[0_16px_64px_rgba(0,0,0,0.5)]',
              'overflow-hidden max-h-[90vh] overflow-y-auto',
              className,
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center h-8 w-8 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors duration-150"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 flex items-center justify-center h-8 w-8 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors duration-150"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

Modal.displayName = 'Modal'
export { Modal }
