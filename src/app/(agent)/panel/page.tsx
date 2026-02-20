'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, UserCheck, Wallet, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { StatusDot } from '@/components/ui/status-dot'
import StatusBadge from '@/components/shared/StatusBadge'
import AnimatedCounter from '@/components/shared/AnimatedCounter'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import GlowOrb from '@/components/shared/GlowOrb'
import MetricsChart from '@/components/agent/MetricsChart'
import { useMockRealtime } from '@/hooks/useMockRealtime'
import {
  getAgentById,
  getAgentStats,
  getProspectsByAgent,
  getTransactionsByProspect,
  getAgentMonthlyMetrics,
} from '@/lib/mock-data'
import {
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
  const monthlyMetrics = getAgentMonthlyMetrics(AGENT_ID)

  const realtimeTotal = useMockRealtime(stats.totalReferrals)

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

      {/* Metrics chart */}
      <ScrollFadeIn delay={0.1}>
        <Card padding="md">
          <MetricsChart data={monthlyMetrics} />
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
