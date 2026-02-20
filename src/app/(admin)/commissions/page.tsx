'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BadgeDollarSign, CircleCheckBig, Clock } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import {
  commissions,
  agents,
  prospects as allProspects,
} from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { Commission } from '@/lib/types'

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function agentName(agentId: string): string {
  const a = agents.find((ag) => ag.id === agentId)
  return a ? a.name.split(' ').slice(0, 2).join(' ') : agentId
}

function prospectName(prospectId: string): string {
  const p = allProspects.find((pr) => pr.id === prospectId)
  return p ? p.name.split(' ').slice(0, 2).join(' ') : prospectId
}

/* ------------------------------------------------------------------ */
/*  Period helpers                                                     */
/* ------------------------------------------------------------------ */

type Period = '7d' | '30d' | '3m' | '6m' | 'all'

const PERIODS: { key: Period; label: string }[] = [
  { key: '7d', label: '7 días' },
  { key: '30d', label: '30 días' },
  { key: '3m', label: '3 meses' },
  { key: '6m', label: '6 meses' },
  { key: 'all', label: 'Todo' },
]

function periodToDate(period: Period): Date | undefined {
  if (period === 'all') return undefined
  const now = new Date('2026-02-20')
  if (period === '7d') now.setDate(now.getDate() - 7)
  else if (period === '30d') now.setDate(now.getDate() - 30)
  else if (period === '3m') now.setMonth(now.getMonth() - 3)
  else if (period === '6m') now.setMonth(now.getMonth() - 6)
  return now
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CommissionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [agentFilter, setAgentFilter] = useState<string>('all')
  const [period, setPeriod] = useState<Period>('all')

  /* Summary stats */
  const totalGenerated = useMemo(
    () => commissions.reduce((sum, c) => sum + c.amount, 0),
    [],
  )
  const totalPaid = useMemo(
    () =>
      commissions
        .filter((c) => c.status === 'paid')
        .reduce((sum, c) => sum + c.amount, 0),
    [],
  )
  const totalPending = useMemo(
    () =>
      commissions
        .filter((c) => c.status === 'pending')
        .reduce((sum, c) => sum + c.amount, 0),
    [],
  )

  /* Filtered data */
  const filtered = useMemo(() => {
    let result = [...commissions]

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }
    if (agentFilter !== 'all') {
      result = result.filter((c) => c.agentId === agentFilter)
    }
    const fromDate = periodToDate(period)
    if (fromDate) {
      result = result.filter((c) => new Date(c.createdAt) >= fromDate)
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [statusFilter, agentFilter, period])

  /* Table columns */
  const columns: Column<Commission>[] = [
    {
      key: 'agent',
      label: 'Agente',
      render: (row) => (
        <span className="font-medium text-white">{agentName(row.agentId)}</span>
      ),
    },
    {
      key: 'client',
      label: 'Cliente',
      render: (row) => (
        <span className="text-white/70">{prospectName(row.prospectId)}</span>
      ),
    },
    {
      key: 'transaction',
      label: 'Transacción',
      render: () => (
        <span className="text-white/50 text-xs">
          Fondeo – compra de mexas
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Monto',
      align: 'right' as const,
      render: (row) => (
        <span className="font-semibold text-white tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'rate',
      label: 'Tasa',
      align: 'center' as const,
      render: (row) => (
        <span className="text-white/50 text-xs tabular-nums">
          {(row.rate * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row) => (
        <Badge variant={row.status === 'paid' ? 'success' : 'warning'}>
          {row.status === 'paid' ? 'Pagada' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      key: 'period',
      label: 'Período',
      render: (row) => <span className="text-white/50 text-xs">{row.period}</span>,
    },
    {
      key: 'date',
      label: 'Fecha',
      align: 'right' as const,
      render: (row) => (
        <span className="text-white/40 text-xs">{formatDate(row.createdAt)}</span>
      ),
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white tracking-tight">Comisiones</h1>
        <p className="mt-1 text-sm text-white/40">
          {commissions.length} comisiones totales
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Generadas"
            value={formatCurrency(totalGenerated)}
            icon={<BadgeDollarSign />}
            index={0}
          />
          <StatCard
            label="Total Pagadas"
            value={formatCurrency(totalPaid)}
            icon={<CircleCheckBig />}
            index={1}
          />
          <StatCard
            label="Pendientes"
            value={formatCurrency(totalPending)}
            icon={<Clock />}
            index={2}
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="space-y-3">
        {/* Period pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`relative shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                period === p.key
                  ? 'text-white bg-white/[0.08] border border-white/[0.08]'
                  : 'text-white/30 hover:text-white/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Status + Agent selects */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Estado"
            selectSize="sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all" className="bg-[#111111]">Todos</option>
            <option value="pending" className="bg-[#111111]">Pendiente</option>
            <option value="paid" className="bg-[#111111]">Pagada</option>
          </Select>
          <Select
            label="Agente"
            selectSize="sm"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
          >
            <option value="all" className="bg-[#111111]">Todos</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#111111]">
                {a.name.split(' ').slice(0, 2).join(' ')}
              </option>
            ))}
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <ScrollFadeIn>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(row) => row.id}
          emptyMessage="No se encontraron comisiones"
        />
      </ScrollFadeIn>
    </motion.div>
  )
}
