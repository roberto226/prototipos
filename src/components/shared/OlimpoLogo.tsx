'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface OlimpoLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: { text: 'text-sm' },
  md: { text: 'text-xl' },
  lg: { text: 'text-3xl' },
}

export default function OlimpoLogo({
  size = 'md',
  showText = true,
  className,
}: OlimpoLogoProps) {
  const s = sizeMap[size]

  if (!showText) return null

  return (
    <motion.span
      className={cn(
        s.text,
        'font-semibold tracking-tight olimpo-text',
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Olimpo
    </motion.span>
  )
}
