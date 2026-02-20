'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Wallet,
  CreditCard,
  BadgeDollarSign,
  CircleCheckBig,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import StatusBadge from '@/components/shared/StatusBadge'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import GlowOrb from '@/components/shared/GlowOrb'
import GridPattern from '@/components/shared/GridPattern'
import { Badge } from '@/components/ui/badge'
import {
  getGlobalStats,
  prospects,
  agents,
} from '@/lib/mock-data'
import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from '@/lib/formatters'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PROGRAM_LABELS,
  CLIENT_TYPE_LABELS,
} from '@/lib/constants'
import type { DashboardFilters, Prospect } from '@/lib/types'

/* ------------------------------------------------------------------ */
/*  Stagger animation                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

/* ------------------------------------------------------------------ */
/*  Helper: get agent name                                             */
/* ------------------------------------------------------------------ */

function agentName(agentId: string): string {
  const a = agents.find((ag) => ag.id === agentId)
  return a ? a.name.split(' ').slice(0, 2).join(' ') : agentId
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const router = useRouter()

  const [filters, setFilters] = useState<DashboardFilters>({
    dateFrom: undefined,
    dateTo: undefined,
    clientType: 'all',
    program: 'all',
  })

  const stats = useMemo(() => getGlobalStats(filters), [filters])

  /* Recent referrals (last 10, sorted by date desc) */
  const recentReferrals = useMemo(() => {
    const sorted = [...prospects].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return sorted.slice(0, 10)
  }, [])

  /* Status funnel */
  const total = stats.totalReferrals || 1
  const funnel = [
    { label: STATUS_LABELS.invited, count: stats.statusBreakdown.invited, color: STATUS_COLORS.invited },
    { label: STATUS_LABELS.registered, count: stats.statusBreakdown.registered, color: STATUS_COLORS.registered },
    { label: STATUS_LABELS.active, count: stats.statusBreakdown.active, color: STATUS_COLORS.active },
    { label: STATUS_LABELS.churn, count: stats.statusBreakdown.churn, color: STATUS_COLORS.churn },
  ]

  /* Table columns */
  const columns: Column<Prospect>[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => <span className="font-medium text-white">{row.name}</span>,
    },
    {
      key: 'agent',
      label: 'Agente',
      render: (row) => <span className="text-white/60">{agentName(row.referredByAgentId)}</span>,
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (row) => (
        <Badge variant={row.clientType === 'vip' ? 'vip' : 'standard'}>
          {CLIENT_TYPE_LABELS[row.clientType]}
        </Badge>
      ),
    },
    {
      key: 'program',
      label: 'Programa',
      render: (row) => <span className="text-white/60">{PROGRAM_LABELS[row.program]}</span>,
    },
    {
      key: 'status',
      label: 'Estatus',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'date',
      label: 'Fecha',
      align: 'right' as const,
      render: (row) => <span className="text-white/40 text-xs">{formatDate(row.createdAt)}</span>,
    },
  ]

  return (
    <div className="relative">
      {/* Ambient background */}
      <GlowOrb
        color="#94A3B8"
        size={500}
        position={{ top: '-200px', right: '-100px' }}
        className="opacity-[0.03]"
      />
      <GlowOrb
        color="#64748B"
        size={350}
        position={{ top: '400px', left: '-150px' }}
        delay={2}
        className="opacity-[0.03]"
      />
      <GridPattern className="opacity-[0.02]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-8"
      >
        {/* Page Title */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-white/40">
            Vista general del programa de referenciaciones
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card padding="sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input
                label="Desde"
                type="date"
                inputSize="sm"
                value={filters.dateFrom ?? ''}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, dateFrom: e.target.value || undefined }))
                }
              />
              <Input
                label="Hasta"
                type="date"
                inputSize="sm"
                value={filters.dateTo ?? ''}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, dateTo: e.target.value || undefined }))
                }
              />
              <Select
                label="Tipo de cliente"
                selectSize="sm"
                value={filters.clientType ?? 'all'}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    clientType: e.target.value as DashboardFilters['clientType'],
                  }))
                }
              >
                <option value="all" className="bg-[#111111]">Todos</option>
                <option value="vip" className="bg-[#111111]">VIP</option>
                <option value="standard" className="bg-[#111111]">Standard</option>
              </Select>
              <Select
                label="Programa"
                selectSize="sm"
                value={filters.program ?? 'all'}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    program: e.target.value as DashboardFilters['program'],
                  }))
                }
              >
                <option value="all" className="bg-[#111111]">Todos</option>
                <option value="empresa_eb1" className="bg-[#111111]">Empresa EB 1</option>
                <option value="empresa_eb2" className="bg-[#111111]">Empresa EB 2</option>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* KPI Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Referenciaciones"
              value={stats.totalReferrals}
              icon={<Users />}
              index={0}
            />
            <StatCard
              label="Agentes Activos"
              value={stats.activeAgents}
              icon={<UserCheck />}
              index={1}
            />
            <StatCard
              label="Tasa de Conversión"
              value={formatPercentage(stats.conversionRate)}
              icon={<TrendingUp />}
              index={2}
            />
            <StatCard
              label="Volumen Total"
              value={formatCurrency(stats.totalTransactionVolume)}
              icon={<DollarSign />}
              index={3}
            />
            <StatCard
              label="Total Fondeo"
              value={formatCurrency(stats.totalFunding)}
              icon={<Wallet />}
              index={4}
            />
            <StatCard
              label="Compras con Tarjeta"
              value={formatCurrency(stats.totalPurchases)}
              icon={<CreditCard />}
              index={5}
            />
            <StatCard
              label="Comisión Generada"
              value={formatCurrency(stats.commissionGenerated)}
              icon={<BadgeDollarSign />}
              index={6}
            />
            <StatCard
              label="Comisión Pagada"
              value={formatCurrency(stats.commissionPaid)}
              icon={<CircleCheckBig />}
              index={7}
            />
          </div>
        </motion.div>

        {/* Status Funnel */}
        <ScrollFadeIn>
          <Card>
            <CardHeader>
              <CardTitle>Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {funnel.map((step) => (
                  <div key={step.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-white/85 font-medium">{step.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white tabular-nums">
                          {step.count}
                        </span>
                        <span className="text-xs text-white/40 tabular-nums">
                          ({formatPercentage((step.count / total) * 100)})
                        </span>
                      </div>
                    </div>
                    <ProgressBar
                      value={(step.count / total) * 100}
                      color={step.color}
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollFadeIn>

        {/* Recent Referrals */}
        <ScrollFadeIn delay={0.1}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Referenciaciones Recientes</h2>
            <DataTable
              columns={columns}
              data={recentReferrals}
              rowKey={(row) => row.id}
              onRowClick={(row) => router.push(`/referrals`)}
              emptyMessage="No hay referenciaciones recientes"
            />
          </div>
        </ScrollFadeIn>
      </motion.div>
    </div>
  )
}
