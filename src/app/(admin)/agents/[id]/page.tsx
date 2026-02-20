'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Pencil,
  Check,
  Users,
  UserCheck,
  Wallet,
  BadgeDollarSign,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Modal } from '@/components/ui/modal'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import StatusBadge from '@/components/shared/StatusBadge'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import { StatusDot } from '@/components/ui/status-dot'
import { useToast } from '@/components/ui/toast'
import {
  getAgentById,
  getProspectsByAgent,
  getCommissionsByAgent,
  getAgentStats,
  prospects as allProspects,
} from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { PROGRAM_LABELS, CLIENT_TYPE_LABELS } from '@/lib/constants'
import type { Prospect, Commission } from '@/lib/types'

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
/*  Helper: prospect name by id                                        */
/* ------------------------------------------------------------------ */

function prospectName(prospectId: string): string {
  const p = allProspects.find((pr) => pr.id === prospectId)
  return p ? p.name.split(' ').slice(0, 2).join(' ') : prospectId
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const agentId = params.id as string

  const agent = getAgentById(agentId)

  const [editOpen, setEditOpen] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState(agent?.name ?? '')
  const [editEmail, setEditEmail] = useState(agent?.email ?? '')
  const [editPhone, setEditPhone] = useState(agent?.phone ?? '')
  const [editVIP, setEditVIP] = useState(agent?.permissions.canReferVIP ?? false)
  const [editStandard, setEditStandard] = useState(agent?.permissions.canReferStandard ?? true)
  const [editCredit, setEditCredit] = useState(agent?.permissions.canGrantCredit ?? false)
  const [editMaxCredit, setEditMaxCredit] = useState(
    agent?.permissions.maxCreditLineAmount ?? 0,
  )
  const [saving, setSaving] = useState(false)

  const agentProspects = useMemo(
    () => (agent ? getProspectsByAgent(agentId) : []),
    [agent, agentId],
  )
  const agentCommissions = useMemo(
    () => (agent ? getCommissionsByAgent(agentId) : []),
    [agent, agentId],
  )
  const stats = useMemo(
    () => (agent ? getAgentStats(agentId) : null),
    [agent, agentId],
  )

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white/50 text-lg">Agente no encontrado</p>
        <Link href="/agents" className="mt-4">
          <Button variant="secondary" icon={<ArrowLeft />}>
            Volver a Agentes
          </Button>
        </Link>
      </div>
    )
  }

  const handleEditSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast({ variant: 'success', message: 'Agente actualizado correctamente' })
    setSaving(false)
    setEditOpen(false)
  }

  /* Prospect table columns */
  const prospectColumns: Column<Prospect>[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => <span className="font-medium text-white">{row.name}</span>,
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

  /* Commission table columns */
  const commissionColumns: Column<Commission>[] = [
    {
      key: 'client',
      label: 'Cliente',
      render: (row) => (
        <span className="text-white/85">{prospectName(row.prospectId)}</span>
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
      render: (row) => <span className="text-white/40 text-xs">{formatDate(row.createdAt)}</span>,
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Back + Header */}
      <motion.div variants={itemVariants}>
        <Link href="/agents" className="inline-block mb-4">
          <Button variant="secondary" size="sm" icon={<ArrowLeft />}>
            Volver a Agentes
          </Button>
        </Link>

        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <Avatar name={agent.name} src={agent.avatarUrl} size="lg" />
              <div>
                <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                <p className="text-sm text-white/50 mt-0.5">{agent.email}</p>
                <p className="text-sm text-white/40">{agent.phone}</p>
                <div className="mt-2">
                  <StatusDot
                    color={agent.status === 'active' ? 'green' : 'gray'}
                    pulse={agent.status === 'active'}
                    label={agent.status === 'active' ? 'Activo' : 'Inactivo'}
                  />
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Pencil />}
              onClick={() => setEditOpen(true)}
            >
              Editar
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Permissions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Permisos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {agent.permissions.canReferVIP && <Badge variant="vip">Puede referenciar VIP</Badge>}
              {agent.permissions.canReferStandard && (
                <Badge variant="info">Puede referenciar Standard</Badge>
              )}
              {agent.permissions.canGrantCredit && (
                <Badge variant="success">
                  Crédito hasta {formatCurrency(agent.permissions.maxCreditLineAmount)}
                </Badge>
              )}
              {!agent.permissions.canGrantCredit && (
                <Badge variant="default">Sin acceso a crédito</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Refs"
              value={stats.totalReferrals}
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
              label="Total Fondeo"
              value={formatCurrency(stats.totalFunding)}
              icon={<Wallet />}
              index={2}
            />
            <StatCard
              label="Comisiones"
              value={formatCurrency(stats.commissionGenerated)}
              icon={<BadgeDollarSign />}
              index={3}
            />
          </div>
        </motion.div>
      )}

      {/* Referrals Table */}
      <ScrollFadeIn>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Referenciaciones</h2>
          <DataTable
            columns={prospectColumns}
            data={agentProspects}
            rowKey={(row) => row.id}
            emptyMessage="Este agente no tiene referenciaciones"
          />
        </div>
      </ScrollFadeIn>

      {/* Commissions Table */}
      <ScrollFadeIn delay={0.1}>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Comisiones</h2>
          <DataTable
            columns={commissionColumns}
            data={agentCommissions}
            rowKey={(row) => row.id}
            emptyMessage="No hay comisiones para este agente"
          />
        </div>
      </ScrollFadeIn>

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar Agente"
        maxWidth="max-w-xl"
      >
        <div className="space-y-5">
          <Input
            label="Nombre completo"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <Input
            label="Celular"
            type="tel"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
          />

          <div className="pt-2 border-t border-white/[0.06]">
            <p className="text-sm font-medium text-white/85 mb-4">Permisos</p>
            <div className="space-y-4">
              <Toggle
                checked={editVIP}
                onChange={setEditVIP}
                label="Puede referenciar VIP"
              />
              <Toggle
                checked={editStandard}
                onChange={setEditStandard}
                label="Puede referenciar Standard"
              />
              <Toggle
                checked={editCredit}
                onChange={setEditCredit}
                label="Puede otorgar crédito"
              />
              {editCredit && (
                <div className="pl-[54px]">
                  <CurrencyInput
                    label="Monto máximo de línea"
                    value={editMaxCredit}
                    onChange={setEditMaxCredit}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSave} loading={saving} icon={<Check />}>
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
