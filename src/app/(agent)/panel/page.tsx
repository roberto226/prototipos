'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserCheck, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Check, Clock } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Avatar } from '@/components/ui/avatar'
import { StatusDot } from '@/components/ui/status-dot'
import StatusBadge from '@/components/shared/StatusBadge'
import AnimatedCounter from '@/components/shared/AnimatedCounter'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import GlowOrb from '@/components/shared/GlowOrb'
import { useMockRealtime } from '@/hooks/useMockRealtime'
import {
  getAgentById,
  getAgentStats,
  getProspectsByAgent,
  getProspectById,
  getTransactionsByProspect,
  getCommissionsByAgent,
} from '@/lib/mock-data'
import { transactions } from '@/lib/mock-data'
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDateShort,
} from '@/lib/formatters'
import {
  PROGRAM_LABELS,
  PROGRAM_COLORS,
} from '@/lib/constants'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const AGENT_ID = 'agent-001'

const ease = [0.16, 1, 0.3, 1] as const

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PanelPage() {
  const agent = getAgentById(AGENT_ID)!
  const stats = getAgentStats(AGENT_ID)
  const prospects = getProspectsByAgent(AGENT_ID)
  const allCommissions = getCommissionsByAgent(AGENT_ID)

  const realtimeTotal = useMockRealtime(stats.totalReferrals)

  /* Date range filter for commissions */
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  const filteredCommissions = useMemo(() => {
    let filtered = [...allCommissions]
    if (dateFrom) {
      const from = new Date(dateFrom)
      filtered = filtered.filter((c) => new Date(c.createdAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      filtered = filtered.filter((c) => new Date(c.createdAt) <= to)
    }
    return filtered
  }, [allCommissions, dateFrom, dateTo])

  const filteredGenerated = filteredCommissions.reduce((sum, c) => sum + c.amount, 0)
  const filteredPaid = filteredCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0)
  const filteredPending = Math.round((filteredGenerated - filteredPaid) * 100) / 100

  const filteredPercent =
    filteredGenerated > 0
      ? Math.round((filteredPaid / filteredGenerated) * 100)
      : 0

  const recentProspects = useMemo(
    () =>
      [...prospects]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [prospects],
  )

  const firstName = agent.name.split(' ')[0]

  return (
    <div className="relative py-6 flex flex-col gap-8">
      {/* Ambient glow */}
      <GlowOrb
        color="#94A3B8"
        size={300}
        position={{ top: '-80px', right: '-100px' }}
        className="opacity-[0.03]"
      />
      <GlowOrb
        color="#64748B"
        size={250}
        position={{ top: '400px', left: '-120px' }}
        delay={2}
        className="opacity-[0.03]"
      />

      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <h1 className="text-2xl font-bold text-white">
          Hola, {firstName}
        </h1>
        <p className="mt-1 text-sm text-white/50">Tu resumen de hoy</p>
      </motion.div>

      {/* Stat cards 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Total Referidos"
          value={Math.round(realtimeTotal)}
          icon={<Users />}
          index={0}
        />
        <StatCard
          label="Activos"
          value={stats.active}
          icon={<UserCheck />}
          index={1}
        />
        <StatCard
          label="Volumen Total"
          value={formatCurrencyCompact(stats.totalFunding + stats.totalPurchases)}
          icon={<TrendingUp />}
          index={2}
        />
        <StatCard
          label="Comisión Ganada"
          value={formatCurrencyCompact(stats.commissionGenerated)}
          icon={<Wallet />}
          index={3}
        />
      </div>

      {/* Commission summary with date range */}
      <ScrollFadeIn delay={0.1}>
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/85">
              Resumen de Comisiones
            </h2>
            <span className="text-xs text-white/40 tabular-nums">
              {formatCurrency(Math.round(filteredPaid * 100) / 100)} / {formatCurrency(Math.round(filteredGenerated * 100) / 100)}
            </span>
          </div>

          {/* Date range filter */}
          <div className="flex items-end gap-3 mb-4">
            <Input
              label="Desde"
              type="date"
              inputSize="sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1"
            />
            <Input
              label="Hasta"
              type="date"
              inputSize="sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="flex-1"
            />
          </div>

          <ProgressBar
            value={filteredPercent}
            gradient
            size="md"
            label="Pagado vs Generado"
            showValue
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white/40">Pagado</span>
              <span className="text-base font-bold text-emerald-400 tabular-nums">
                {formatCurrency(Math.round(filteredPaid * 100) / 100)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white/40">Pendiente</span>
              <span className="text-base font-bold text-white/85 tabular-nums">
                {formatCurrency(Math.round(filteredPending * 100) / 100)}
              </span>
            </div>
          </div>

          {/* Commission list */}
          <div className="mt-5 border-t border-white/[0.06] pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white/50">
                Detalle de Comisiones
              </span>
              <span className="text-[11px] text-white/30 tabular-nums">
                {filteredCommissions.length} movimientos
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto scrollbar-none">
              <AnimatePresence mode="popLayout">
                {filteredCommissions.length === 0 ? (
                  <motion.div
                    key="empty-comm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center text-white/25 text-xs"
                  >
                    No hay comisiones en este rango de fechas
                  </motion.div>
                ) : (
                  [...filteredCommissions]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((comm, idx) => {
                      const prospect = getProspectById(comm.prospectId)
                      const txn = transactions.find((t) => t.id === comm.transactionId)
                      const isFunding = txn?.type === 'funding'

                      return (
                        <motion.div
                          key={comm.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.25, ease, delay: Math.min(idx * 0.03, 0.3) }}
                          className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5 border border-white/[0.04]"
                        >
                          {/* Icon */}
                          <div className={`flex items-center justify-center h-8 w-8 rounded-lg shrink-0 ${isFunding ? 'bg-teal-500/10' : 'bg-emerald-500/10'}`}>
                            {isFunding
                              ? <ArrowDownLeft className="h-3.5 w-3.5 text-teal-400" />
                              : <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                            }
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium text-white/80 truncate">
                                {prospect?.name ?? 'Prospecto'}
                              </span>
                              <span className="text-xs font-bold text-white/90 tabular-nums shrink-0">
                                {formatCurrency(comm.amount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-white/30">
                                  {formatDateShort(comm.createdAt)}
                                </span>
                                <span className="text-[10px] text-white/20">·</span>
                                <span className="text-[10px] text-white/30 tabular-nums">
                                  {(comm.rate * 100).toFixed(1)}%
                                </span>
                                <span className="text-[10px] text-white/20">·</span>
                                <span className="text-[10px] text-white/30">
                                  {isFunding ? 'Fondeo' : 'Compra'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {comm.status === 'paid' ? (
                                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium">
                                    <Check className="h-2.5 w-2.5" />
                                    Pagada
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-medium">
                                    <Clock className="h-2.5 w-2.5" />
                                    Pendiente
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </ScrollFadeIn>

      {/* Recent referrals */}
      <ScrollFadeIn delay={0.15}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/85">
            Referenciaciones Recientes
          </h2>
          <span className="text-xs text-white/40">
            <AnimatedCounter value={prospects.length} /> total
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {recentProspects.map((prospect, idx) => {
            const prospectTxns = getTransactionsByProspect(prospect.id)
            const totalVolume = prospectTxns.reduce(
              (sum, t) => sum + t.amount,
              0,
            )

            return (
              <motion.div
                key={prospect.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease,
                  delay: 0.2 + idx * 0.06,
                }}
              >
                <Link href={`/my-referrals/${prospect.id}`}>
                  <Card padding="sm" hoverable className="p-4 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Avatar name={prospect.name} size="md" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-white truncate">
                            {prospect.name}
                          </span>
                          <StatusBadge status={prospect.status} />
                        </div>

                        <div className="mt-1.5 flex items-center gap-2 text-xs text-white/40">
                          <span>{formatDateShort(prospect.createdAt)}</span>
                          <span className="text-white/15">|</span>
                          <span
                            style={{ color: PROGRAM_COLORS[prospect.program] }}
                            className="font-medium"
                          >
                            {PROGRAM_LABELS[prospect.program]}
                          </span>
                          {totalVolume > 0 && (
                            <>
                              <span className="text-white/15">|</span>
                              <span className="text-emerald-400 font-medium tabular-nums">
                                {formatCurrencyCompact(totalVolume)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </ScrollFadeIn>

      {/* Live indicator */}
      <ScrollFadeIn delay={0.2}>
        <div className="flex items-center justify-center gap-2 py-4">
          <StatusDot color="green" pulse size="sm" />
          <span className="text-xs text-white/30 font-medium">
            Datos en tiempo real
          </span>
        </div>
      </ScrollFadeIn>
    </div>
  )
}
