'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import StatusBadge from '@/components/shared/StatusBadge'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import { prospects, agents } from '@/lib/mock-data'
import { formatDate, formatDateTime } from '@/lib/formatters'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PROGRAM_LABELS,
  CLIENT_TYPE_LABELS,
} from '@/lib/constants'
import type { Prospect, ReferralStatus } from '@/lib/types'
import { cn } from '@/lib/cn'

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
/*  Status timeline order                                              */
/* ------------------------------------------------------------------ */

const STATUS_ORDER: ReferralStatus[] = [
  'invited',
  'registered',
  'active',
  'churn',
]

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function agentName(agentId: string): string {
  const a = agents.find((ag) => ag.id === agentId)
  return a ? a.name.split(' ').slice(0, 2).join(' ') : agentId
}

/* ------------------------------------------------------------------ */
/*  Status Timeline Component                                          */
/* ------------------------------------------------------------------ */

function StatusTimeline({ prospect }: { prospect: Prospect }) {
  const currentIdx = STATUS_ORDER.indexOf(prospect.status)

  return (
    <div className="space-y-0">
      {STATUS_ORDER.map((status, idx) => {
        const historyEntry = prospect.statusHistory.find((h) => h.status === status)
        const isCompleted = idx <= currentIdx
        const isCurrent = idx === currentIdx
        const isLast = idx === STATUS_ORDER.length - 1

        return (
          <div key={status} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-3 w-3 rounded-full border-2 shrink-0 mt-0.5',
                  isCompleted
                    ? 'border-transparent'
                    : 'border-white/20 bg-transparent',
                )}
                style={
                  isCompleted
                    ? { backgroundColor: STATUS_COLORS[status] }
                    : undefined
                }
              />
              {!isLast && (
                <div
                  className={cn(
                    'w-px flex-1 min-h-[32px]',
                    isCompleted && idx < currentIdx
                      ? 'bg-white/20'
                      : 'bg-white/[0.06]',
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-5 -mt-0.5">
              <p
                className={cn(
                  'text-sm font-medium',
                  isCompleted ? 'text-white' : 'text-white/25',
                  isCurrent && 'text-white',
                )}
              >
                {STATUS_LABELS[status]}
              </p>
              {historyEntry && (
                <p className="text-xs text-white/40 mt-0.5">
                  {formatDateTime(historyEntry.timestamp)}
                </p>
              )}
              {!historyEntry && (
                <p className="text-xs text-white/15 mt-0.5">Pendiente</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReferralsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [programFilter, setProgramFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)

  const filtered = useMemo(() => {
    let result = [...prospects]

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }
    if (typeFilter !== 'all') {
      result = result.filter((p) => p.clientType === typeFilter)
    }
    if (programFilter !== 'all') {
      result = result.filter((p) => p.program === programFilter)
    }
    if (dateFrom) {
      const from = new Date(dateFrom)
      result = result.filter((p) => new Date(p.createdAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      result = result.filter((p) => new Date(p.createdAt) <= to)
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [statusFilter, typeFilter, programFilter, dateFrom, dateTo])

  /* Table columns */
  const columns: Column<Prospect>[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => <span className="font-medium text-white">{row.name}</span>,
    },
    {
      key: 'phone',
      label: 'Celular',
      render: (row) => <span className="text-white/50 text-xs">{row.phone ?? '--'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => <span className="text-white/50 text-xs">{row.email ?? '--'}</span>,
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
      render: (row) => <span className="text-white/60 text-xs">{PROGRAM_LABELS[row.program]}</span>,
    },
    {
      key: 'agent',
      label: 'Agente',
      render: (row) => <span className="text-white/60 text-xs">{agentName(row.referredByAgentId)}</span>,
    },
    {
      key: 'method',
      label: 'Método',
      render: (row) => (
        <Badge variant={row.referralMethod === 'direct' ? 'default' : 'info'}>
          {row.referralMethod === 'direct' ? 'Directo' : 'Link'}
        </Badge>
      ),
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white tracking-tight">Referenciaciones</h1>
        <p className="mt-1 text-sm text-white/40">
          {prospects.length} referenciaciones totales
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card padding="sm">
          <div className="flex flex-wrap items-end gap-4">
            <Select
              label="Estatus"
              selectSize="sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-[150px]"
            >
              <option value="all" className="bg-[#111111]">Todos</option>
              <option value="invited" className="bg-[#111111]">Invitado</option>
              <option value="registered" className="bg-[#111111]">Registrado</option>
              <option value="active" className="bg-[#111111]">Activo</option>
              <option value="churn" className="bg-[#111111]">Churn</option>
            </Select>
            <Select
              label="Tipo"
              selectSize="sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-[130px]"
            >
              <option value="all" className="bg-[#111111]">Todos</option>
              <option value="vip" className="bg-[#111111]">VIP</option>
              <option value="standard" className="bg-[#111111]">Standard</option>
            </Select>
            <Select
              label="Programa"
              selectSize="sm"
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-[160px]"
            >
              <option value="all" className="bg-[#111111]">Todos</option>
              <option value="empresa_eb1" className="bg-[#111111]">Empresa EB 1</option>
              <option value="empresa_eb2" className="bg-[#111111]">Empresa EB 2</option>
            </Select>
            <Input
              label="Desde"
              type="date"
              inputSize="sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[155px]"
            />
            <Input
              label="Hasta"
              type="date"
              inputSize="sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[155px]"
            />
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <ScrollFadeIn>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelectedProspect(row)}
          emptyMessage="No se encontraron referenciaciones"
        />
      </ScrollFadeIn>

      {/* Detail Modal */}
      <Modal
        open={!!selectedProspect}
        onClose={() => setSelectedProspect(null)}
        title={selectedProspect?.name ?? 'Detalle'}
        maxWidth="max-w-lg"
      >
        {selectedProspect && (
          <div className="space-y-6">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/40 text-xs mb-0.5">Celular</p>
                <p className="text-white/85">{selectedProspect.phone ?? '--'}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-0.5">Email</p>
                <p className="text-white/85">{selectedProspect.email ?? '--'}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-0.5">Tipo</p>
                <Badge variant={selectedProspect.clientType === 'vip' ? 'vip' : 'standard'}>
                  {CLIENT_TYPE_LABELS[selectedProspect.clientType]}
                </Badge>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-0.5">Programa</p>
                <p className="text-white/85">{PROGRAM_LABELS[selectedProspect.program]}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-0.5">Agente</p>
                <p className="text-white/85">{agentName(selectedProspect.referredByAgentId)}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-0.5">Método</p>
                <Badge variant={selectedProspect.referralMethod === 'direct' ? 'default' : 'info'}>
                  {selectedProspect.referralMethod === 'direct' ? 'Directo' : 'Link de invitación'}
                </Badge>
              </div>
              {selectedProspect.creditAvailable && (
                <>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Crédito</p>
                    <Badge variant="success">Disponible</Badge>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Línea de crédito</p>
                    <p className="text-white/85 font-semibold tabular-nums">
                      {formatDate(String(selectedProspect.creditLineAmount)) !== 'Invalid Date'
                        ? `$${selectedProspect.creditLineAmount.toLocaleString()}`
                        : `$${selectedProspect.creditLineAmount.toLocaleString()}`}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Status timeline */}
            <div className="pt-4 border-t border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white mb-4">Progresión de Estatus</h3>
              <StatusTimeline prospect={selectedProspect} />
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
