'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StatusDot } from '@/components/ui/status-dot'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import { agents, getProspectsByAgent } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/formatters'
import type { Agent } from '@/lib/types'

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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AgentsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return agents
    const q = search.toLowerCase()
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q),
    )
  }, [search])

  /* Table columns */
  const columns: Column<Agent>[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} src={row.avatarUrl} size="sm" />
          <div>
            <p className="font-medium text-white">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => <span className="text-white/60 text-xs">{row.email}</span>,
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (row) => <span className="text-white/50 text-xs">{row.phone}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <StatusDot
          color={row.status === 'active' ? 'green' : 'gray'}
          pulse={row.status === 'active'}
          label={row.status === 'active' ? 'Activo' : 'Inactivo'}
        />
      ),
    },
    {
      key: 'vip',
      label: 'VIP',
      align: 'center',
      render: (row) =>
        row.permissions.canReferVIP ? (
          <Badge variant="vip">VIP</Badge>
        ) : (
          <span className="text-white/20">--</span>
        ),
    },
    {
      key: 'standard',
      label: 'Standard',
      align: 'center',
      render: (row) =>
        row.permissions.canReferStandard ? (
          <Badge variant="info">Std</Badge>
        ) : (
          <span className="text-white/20">--</span>
        ),
    },
    {
      key: 'credit',
      label: 'Crédito',
      align: 'center',
      render: (row) =>
        row.permissions.canGrantCredit ? (
          <Badge variant="success">Si</Badge>
        ) : (
          <span className="text-white/20">No</span>
        ),
    },
    {
      key: 'maxCredit',
      label: 'Línea Máx',
      align: 'right',
      render: (row) =>
        row.permissions.maxCreditLineAmount > 0 ? (
          <span className="text-white/70 tabular-nums text-xs">
            {formatCurrency(row.permissions.maxCreditLineAmount)}
          </span>
        ) : (
          <span className="text-white/20">--</span>
        ),
    },
    {
      key: 'referrals',
      label: 'Refs',
      align: 'right',
      render: (row) => {
        const count = getProspectsByAgent(row.id).length
        return (
          <span className="text-white font-semibold tabular-nums">{count}</span>
        )
      },
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agentes</h1>
          <p className="mt-1 text-sm text-white/40">
            {agents.length} agentes registrados
          </p>
        </div>
        <Link href="/agents/new">
          <Button icon={<Plus />} size="md">
            Agregar Agente
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants}>
        <Input
          placeholder="Buscar por nombre o email..."
          icon={<Search />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </motion.div>

      {/* Table */}
      <ScrollFadeIn>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/agents/${row.id}`)}
          emptyMessage="No se encontraron agentes"
        />
      </ScrollFadeIn>
    </motion.div>
  )
}
