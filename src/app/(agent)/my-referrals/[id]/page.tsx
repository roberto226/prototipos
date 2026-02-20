'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Mail, CreditCard, Wallet } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/shared/StatusBadge'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import {
  getProspectById,
  getTransactionsByProspect,
  getCommissionsByAgent,
} from '@/lib/mock-data'
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatDateShort,
  formatDateTime,
} from '@/lib/formatters'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PROGRAM_LABELS,
  CLIENT_TYPE_LABELS,
} from '@/lib/constants'
import type { ReferralStatus } from '@/lib/types'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ease = [0.16, 1, 0.3, 1] as const

const STATUS_ORDER: ReferralStatus[] = [
  'invited',
  'registered',
  'active',
  'churn',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProspectDetailPage() {
  const params = useParams()
  const prospectId = params.id as string

  const prospect = getProspectById(prospectId)

  const transactions = useMemo(() => {
    if (!prospect) return []
    return getTransactionsByProspect(prospect.id).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [prospect])

  const commissionTotal = useMemo(() => {
    if (!prospect) return 0
    const comms = getCommissionsByAgent(prospect.referredByAgentId)
    return comms
      .filter((c) => c.prospectId === prospect.id)
      .reduce((sum, c) => sum + c.amount, 0)
  }, [prospect])

  const funding = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'funding')
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  )

  const purchases = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'card_purchase')
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  )

  if (!prospect) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white/50 text-lg">Prospecto no encontrado</p>
        <Link href="/my-referrals" className="mt-4">
          <Button variant="secondary" icon={<ArrowLeft />}>
            Volver
          </Button>
        </Link>
      </div>
    )
  }

  const currentStatusIdx = STATUS_ORDER.indexOf(prospect.status)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-6 flex flex-col gap-6"
    >
      {/* Back */}
      <motion.div variants={itemVariants}>
        <Link href="/my-referrals">
          <Button variant="secondary" size="sm" icon={<ArrowLeft />}>
            Mis Referenciaciones
          </Button>
        </Link>
      </motion.div>

      {/* Profile header */}
      <motion.div variants={itemVariants}>
        <Card padding="md">
          <div className="flex items-center gap-4">
            <Avatar name={prospect.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white truncate">
                {prospect.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={prospect.status} />
                <Badge
                  variant={
                    prospect.clientType === 'vip' ? 'vip' : 'standard'
                  }
                >
                  {CLIENT_TYPE_LABELS[prospect.clientType]}
                </Badge>
              </div>
              <p className="text-xs text-white/40 mt-2">
                Registrado {formatDate(prospect.createdAt)}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Contact info */}
      {(prospect.phone || prospect.email) && (
        <motion.div variants={itemVariants}>
          <Card padding="md">
            <div className="flex flex-col gap-3">
              {prospect.phone && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
                    <Phone className="h-4 w-4 text-white/40" />
                  </div>
                  <span className="text-sm text-white/80">
                    {prospect.phone}
                  </span>
                </div>
              )}
              {prospect.email && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
                    <Mail className="h-4 w-4 text-white/40" />
                  </div>
                  <span className="text-sm text-white/80">
                    {prospect.email}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 gap-3">
          <Card padding="sm" className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-500/10">
                <Wallet className="h-4 w-4 text-teal-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Fondeo
                </p>
                <p className="text-sm font-bold text-white tabular-nums">
                  {funding > 0 ? formatCurrencyCompact(funding) : '$0'}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="sm" className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10">
                <CreditCard className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Compras
                </p>
                <p className="text-sm font-bold text-white tabular-nums">
                  {purchases > 0 ? formatCurrencyCompact(purchases) : '$0'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Program & credit info */}
      <motion.div variants={itemVariants}>
        <Card padding="md">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
            Información
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Programa" value={PROGRAM_LABELS[prospect.program]} />
            <InfoItem label="Método" value={prospect.referralMethod === 'direct' ? 'Directo' : 'Link de invitación'} />
            {prospect.creditAvailable && (
              <InfoItem
                label="Línea de crédito"
                value={formatCurrency(prospect.creditLineAmount)}
              />
            )}
          </div>
        </Card>
      </motion.div>

      {/* Status timeline */}
      <ScrollFadeIn delay={0.05}>
        <Card padding="md">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">
            Timeline
          </h3>
          <div className="flex flex-col gap-0">
            {STATUS_ORDER.map((status, i) => {
              const reached = i <= currentStatusIdx
              const historyEntry = prospect.statusHistory.find(
                (h) => h.status === status,
              )

              return (
                <div key={status} className="flex items-stretch gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'h-3 w-3 rounded-full shrink-0 border-2',
                        reached
                          ? 'border-transparent'
                          : 'border-white/10 bg-transparent',
                      )}
                      style={
                        reached
                          ? {
                              backgroundColor: STATUS_COLORS[status],
                              boxShadow: `0 0 8px ${STATUS_COLORS[status]}40`,
                            }
                          : undefined
                      }
                    />
                    {i < STATUS_ORDER.length - 1 && (
                      <div
                        className={cn(
                          'w-[1px] flex-1 min-h-[28px]',
                          i < currentStatusIdx
                            ? 'bg-white/15'
                            : 'bg-white/[0.06]',
                        )}
                      />
                    )}
                  </div>

                  <div className="pb-4">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        reached ? 'text-white/85' : 'text-white/25',
                      )}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                    {historyEntry && (
                      <span className="block text-xs text-white/40 mt-0.5">
                        {formatDateTime(historyEntry.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </ScrollFadeIn>

      {/* Transaction history */}
      {transactions.length > 0 && (
        <ScrollFadeIn delay={0.1}>
          <Card padding="md">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
              Transacciones
            </h3>
            <div className="flex flex-col gap-2">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/[0.03]"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-white/70">
                      {txn.description}
                    </span>
                    <span className="text-[10px] text-white/30">
                      {formatDateShort(txn.createdAt)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      txn.type === 'funding'
                        ? 'text-teal-400'
                        : 'text-emerald-400',
                    )}
                  >
                    {formatCurrency(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </ScrollFadeIn>
      )}

      {/* Commission */}
      {commissionTotal > 0 && (
        <ScrollFadeIn delay={0.15}>
          <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] border border-white/[0.06] px-5 py-4">
            <span className="text-sm text-white/50">Comisión generada</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">
              {formatCurrency(Math.round(commissionTotal * 100) / 100)}
            </span>
          </div>
        </ScrollFadeIn>
      )}
    </motion.div>
  )
}

/* ================================================================== */
/*  InfoItem helper                                                    */
/* ================================================================== */

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-white/30 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm text-white/85 font-medium">{value}</span>
    </div>
  )
}
