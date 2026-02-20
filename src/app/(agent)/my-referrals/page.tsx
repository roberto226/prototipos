'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import StatusBadge from '@/components/shared/StatusBadge'
import AnimatedCounter from '@/components/shared/AnimatedCounter'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import {
  getProspectsByAgent,
  getTransactionsByProspect,
} from '@/lib/mock-data'

import {
  formatCurrencyCompact,
  formatDateShort,
} from '@/lib/formatters'
import {
  STATUS_LABELS,
  PROGRAM_LABELS,
  PROGRAM_COLORS,
  CLIENT_TYPE_LABELS,
} from '@/lib/constants'
import type { ReferralStatus, Prospect } from '@/lib/types'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const AGENT_ID = 'agent-001'
const ease = [0.16, 1, 0.3, 1] as const

type TabFilter = 'all' | ReferralStatus

const TABS: { value: TabFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'invited', label: 'Invitados' },
  { value: 'registered', label: 'Registrados' },
  { value: 'active', label: 'Activos' },
  { value: 'churn', label: 'Churn' },
]


/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MyReferralsPage() {
  const allProspects = getProspectsByAgent(AGENT_ID)

  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  /* ------ Filter ------ */

  const filteredProspects = useMemo(() => {
    const sorted = [...allProspects].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    if (activeTab === 'all') return sorted
    return sorted.filter((p) => p.status === activeTab)
  }, [allProspects, activeTab])

  /* ------ Render ------ */

  return (
    <div className="relative py-6 flex flex-col gap-6">
      {/* Title */}
      <ScrollFadeIn>
        <h1 className="text-xl font-bold text-white mb-1">
          Mis Referenciaciones
        </h1>
        <p className="text-sm text-white/50">
          <AnimatedCounter value={allProspects.length} /> prospectos referidos
        </p>
      </ScrollFadeIn>

      {/* Tab filter bar */}
      <ScrollFadeIn delay={0.05}>
        <div className="-mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value
              const count =
                tab.value === 'all'
                  ? allProspects.length
                  : allProspects.filter((p) => p.status === tab.value).length

              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium',
                    'transition-colors duration-200 whitespace-nowrap',
                    isActive
                      ? 'text-white bg-white/[0.06]'
                      : 'text-white/40 hover:text-white/60',
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'text-[10px] tabular-nums',
                      isActive ? 'text-white/60' : 'text-white/25',
                    )}
                  >
                    {count}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-300"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </ScrollFadeIn>

      {/* Animated count */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        className="flex items-center gap-2"
      >
        <span className="text-3xl font-bold text-white tabular-nums">
          <AnimatedCounter value={filteredProspects.length} />
        </span>
        <span className="text-sm text-white/40">
          {activeTab === 'all' ? 'referenciaciones' : STATUS_LABELS[activeTab as ReferralStatus].toLowerCase()}
        </span>
      </motion.div>

      {/* Referral cards */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filteredProspects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={<Users />}
                title="Sin referenciaciones"
                description="No hay prospectos con este filtro."
              />
            </motion.div>
          ) : (
            filteredProspects.map((prospect, idx) => (
              <ReferralCard
                key={prospect.id}
                prospect={prospect}
                index={idx}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  ReferralCard sub-component                                         */
/* ================================================================== */

function ReferralCard({
  prospect,
  index,
}: {
  prospect: Prospect
  index: number
}) {
  const txns = useMemo(
    () => getTransactionsByProspect(prospect.id),
    [prospect.id],
  )

  const funding = txns
    .filter((t) => t.type === 'funding')
    .reduce((s, t) => s + t.amount, 0)
  const purchases = txns
    .filter((t) => t.type === 'card_purchase')
    .reduce((s, t) => s + t.amount, 0)
  const hasVolume = funding > 0 || purchases > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Link href={`/my-referrals/${prospect.id}`}>
        <Card
          padding="sm"
          hoverable
          className="p-4 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <Avatar name={prospect.name} size="md" />

            <div className="flex-1 min-w-0">
              {/* Row 1: name + status */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-medium text-white truncate">
                  {prospect.name}
                </span>
                <StatusBadge status={prospect.status} />
              </div>

              {/* Row 2: badges */}
              <div className="flex items-center flex-wrap gap-1.5 mb-2">
                <Badge
                  variant={prospect.clientType === 'vip' ? 'vip' : 'standard'}
                >
                  {CLIENT_TYPE_LABELS[prospect.clientType]}
                </Badge>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: PROGRAM_COLORS[prospect.program] }}
                >
                  {PROGRAM_LABELS[prospect.program]}
                </span>
              </div>

              {/* Row 3: date + volume */}
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span>{formatDateShort(prospect.createdAt)}</span>

                {hasVolume && (
                  <>
                    <span className="text-white/15">|</span>
                    {funding > 0 && (
                      <span className="text-teal-400 font-medium tabular-nums">
                        Fondeo {formatCurrencyCompact(funding)}
                      </span>
                    )}
                    {purchases > 0 && (
                      <>
                        {funding > 0 && (
                          <span className="text-white/15">|</span>
                        )}
                        <span className="text-emerald-400 font-medium tabular-nums">
                          Compras {formatCurrencyCompact(purchases)}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

