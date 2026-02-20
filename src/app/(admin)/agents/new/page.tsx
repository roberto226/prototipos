'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import { PROGRAM_LABELS } from '@/lib/constants'
import type { OlimpoProgram } from '@/lib/types'

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

export default function NewAgentPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [canReferVIP, setCanReferVIP] = useState(false)
  const [canReferStandard, setCanReferStandard] = useState(true)
  const [canGrantCredit, setCanGrantCredit] = useState(false)
  const [maxCreditLine, setMaxCreditLine] = useState(0)
  const [allowedPrograms, setAllowedPrograms] = useState<Record<OlimpoProgram, boolean>>({
    empresa_eb1: true,
    empresa_eb2: true,
  })
  const [saving, setSaving] = useState(false)

  const toggleProgram = (program: OlimpoProgram) => {
    setAllowedPrograms((prev) => ({ ...prev, [program]: !prev[program] }))
  }

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) return

    setSaving(true)

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      variant: 'success',
      message: `Agente "${name}" creado exitosamente`,
    })

    setSaving(false)
    router.push('/agents')
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Link href="/agents">
          <Button variant="secondary" size="sm" icon={<ArrowLeft />}>
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Nuevo Agente</h1>
          <p className="mt-1 text-sm text-white/40">
            Completa la información para registrar un nuevo agente
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <ScrollFadeIn>
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <Input
                label="Nombre completo"
                placeholder="Ej. María López García"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Ej. maria.lopez@olimpo.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Celular"
                type="tel"
                placeholder="Ej. +52 55 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Programs */}
      <ScrollFadeIn delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle>Empresas Autorizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-white/40 mb-4">
              Selecciona para qué empresas puede referenciar este agente
            </p>
            <div className="space-y-4">
              {(Object.entries(PROGRAM_LABELS) as [OlimpoProgram, string][]).map(
                ([key, label]) => (
                  <Toggle
                    key={key}
                    checked={allowedPrograms[key]}
                    onChange={() => toggleProgram(key)}
                    label={label}
                  />
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Permissions */}
      <ScrollFadeIn delay={0.14}>
        <Card>
          <CardHeader>
            <CardTitle>Permisos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Toggle
                checked={canReferVIP}
                onChange={setCanReferVIP}
                label="Puede referenciar VIP"
              />
              <Toggle
                checked={canReferStandard}
                onChange={setCanReferStandard}
                label="Puede referenciar Standard"
              />
              <div className="space-y-3">
                <Toggle
                  checked={canGrantCredit}
                  onChange={setCanGrantCredit}
                  label="Puede otorgar crédito"
                />
                {canGrantCredit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                    className="pl-[54px]"
                  >
                    <CurrencyInput
                      label="Monto máximo de línea de crédito"
                      value={maxCreditLine}
                      onChange={setMaxCreditLine}
                      placeholder="$0"
                      hint="Monto en MXN"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 pt-2">
        <Link href="/agents">
          <Button variant="secondary">Cancelar</Button>
        </Link>
        <Button
          onClick={handleSave}
          loading={saving}
          icon={<Check />}
          disabled={!name.trim() || !email.trim()}
        >
          Guardar Agente
        </Button>
      </motion.div>
    </motion.div>
  )
}
