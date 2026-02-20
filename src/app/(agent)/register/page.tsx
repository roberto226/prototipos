'use client'

import { useState, useCallback, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  UserPlus,
  ArrowRight,
  MessageCircle,
  MessageSquare,
  Copy,
  Check,
  Share2,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { CurrencyInput } from '@/components/ui/currency-input'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import { getAgentById } from '@/lib/mock-data'
import { PROGRAM_LABELS, CLIENT_TYPE_LABELS } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatters'
import {
  generateId,
  generateInviteCode,
  generateInviteUrl,
  getWhatsAppShareUrl,
  getSmsShareUrl,
  copyToClipboard,
} from '@/lib/utils'
import type { ClientType, OlimpoProgram } from '@/lib/types'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const AGENT_ID = 'agent-001'
const ease = [0.16, 1, 0.3, 1] as const

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  name: string
  phone: string
  email: string
  clientType: ClientType
  program: OlimpoProgram
  creditAvailable: boolean
  creditLineAmount: number
}

interface FormErrors {
  name?: string
  contact?: string
  creditLineAmount?: string
}

interface SubmittedProspect {
  id: string
  name: string
  clientType: ClientType
  program: OlimpoProgram
  creditAvailable: boolean
  creditLineAmount: number
  inviteUrl: string
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RegisterPage() {
  const agent = getAgentById(AGENT_ID)!
  const { permissions } = agent

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    clientType: permissions.canReferVIP ? 'vip' : 'standard',
    program: 'empresa_eb1',
    creditAvailable: false,
    creditLineAmount: 0,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<SubmittedProspect | null>(null)
  const [copied, setCopied] = useState(false)

  /* ------ Validation ------ */

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {}

    if (!formData.name.trim()) {
      errs.name = 'El nombre es requerido'
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      errs.contact = 'Ingresa al menos un celular o email'
    }

    if (
      formData.creditAvailable &&
      formData.creditLineAmount > permissions.maxCreditLineAmount
    ) {
      errs.creditLineAmount = `El monto maximo es ${formatCurrency(permissions.maxCreditLineAmount)}`
    }

    return errs
  }, [formData, permissions.maxCreditLineAmount])

  /* ------ Handlers ------ */

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      if (key === 'name') delete next.name
      if (key === 'phone' || key === 'email') delete next.contact
      if (key === 'creditLineAmount') delete next.creditLineAmount
      return next
    })
  }

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      const errs = validate()
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }

      setIsSubmitting(true)

      // Simulate a short network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const code = generateInviteCode()
      const inviteUrl = generateInviteUrl(code)

      setSubmitted({
        id: generateId(),
        name: formData.name,
        clientType: formData.clientType,
        program: formData.program,
        creditAvailable: formData.creditAvailable,
        creditLineAmount: formData.creditLineAmount,
        inviteUrl,
      })

      setIsSubmitting(false)
    },
    [formData, validate],
  )

  const resetForm = useCallback(() => {
    setSubmitted(null)
    setCopied(false)
    setFormData({
      name: '',
      phone: '',
      email: '',
      clientType: permissions.canReferVIP ? 'vip' : 'standard',
      program: 'empresa_eb1',
      creditAvailable: false,
      creditLineAmount: 0,
    })
    setErrors({})
  }, [permissions.canReferVIP])

  /* ------ Share handlers ------ */

  const handleCopy = useCallback(async (url: string) => {
    await copyToClipboard(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [])

  const handleWhatsApp = useCallback((url: string) => {
    const shareUrl = getWhatsAppShareUrl(url, 'Te invito a unirte al programa:')
    window.open(shareUrl, '_blank')
  }, [])

  const handleSms = useCallback((url: string) => {
    const shareUrl = getSmsShareUrl(url, 'Te invito a unirte al programa:')
    window.open(shareUrl, '_blank')
  }, [])

  /* ------ Render ------ */

  return (
    <div className="relative py-6">
      <AnimatePresence mode="wait">
        {submitted ? (
          /* ============================================ */
          /*  Success state                               */
          /* ============================================ */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease }}
            className="flex flex-col items-center text-center py-8"
          >
            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease }}
              className="text-xl font-bold text-white"
            >
              Prospecto registrado exitosamente
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease }}
              className="mt-2 text-sm text-white/50 max-w-xs"
            >
              El prospecto ha sido agregado a tu cartera de referenciaciones.
            </motion.p>

            {/* Prospect summary card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease }}
              className="mt-8 w-full max-w-sm rounded-2xl bg-[#111111] border border-white/[0.06] p-5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Nombre</span>
                  <span className="text-sm font-medium text-white">
                    {submitted.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Tipo</span>
                  <span className="text-sm font-medium text-white">
                    {CLIENT_TYPE_LABELS[submitted.clientType]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Programa</span>
                  <span className="text-sm font-medium text-white">
                    {PROGRAM_LABELS[submitted.program]}
                  </span>
                </div>
                {submitted.creditAvailable && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">
                      Linea de credito
                    </span>
                    <span className="text-sm font-medium text-emerald-400 tabular-nums">
                      {formatCurrency(submitted.creditLineAmount)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Share section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease }}
              className="mt-6 w-full max-w-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="h-4 w-4 text-white/40" />
                <span className="text-xs font-medium text-white/50 uppercase tracking-wide">
                  Compartir link de descarga
                </span>
              </div>

              {/* Link display */}
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 mb-4">
                <code className="flex-1 text-xs text-white/60 font-mono truncate">
                  {submitted.inviteUrl}
                </code>
                <button
                  onClick={() => handleCopy(submitted.inviteUrl)}
                  className={cn(
                    'shrink-0 p-1.5 rounded-lg transition-colors',
                    'text-white/40 hover:text-white/80 hover:bg-white/[0.06]',
                  )}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleWhatsApp(submitted.inviteUrl)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2',
                    'rounded-xl py-4 px-3',
                    'bg-emerald-500/10 border border-emerald-500/20',
                    'text-emerald-400',
                    'transition-colors hover:bg-emerald-500/15',
                    'active:bg-emerald-500/20',
                  )}
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-xs font-medium">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleSms(submitted.inviteUrl)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2',
                    'rounded-xl py-4 px-3',
                    'bg-sky-500/10 border border-sky-500/20',
                    'text-sky-400',
                    'transition-colors hover:bg-sky-500/15',
                    'active:bg-sky-500/20',
                  )}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-xs font-medium">SMS</span>
                </button>

                <button
                  onClick={() => handleCopy(submitted.inviteUrl)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2',
                    'rounded-xl py-4 px-3',
                    'bg-white/[0.04] border border-white/[0.08]',
                    'text-white/60',
                    'transition-colors hover:bg-white/[0.06]',
                    'active:bg-white/[0.08]',
                  )}
                >
                  {copied ? (
                    <Check className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <Copy className="h-6 w-6" />
                  )}
                  <span className="text-xs font-medium">
                    {copied ? 'Copiado!' : 'Copiar'}
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4, ease }}
              className="mt-8 flex flex-col gap-3 w-full max-w-sm"
            >
              <Button
                onClick={resetForm}
                variant="primary"
                size="lg"
                icon={<UserPlus />}
                className="w-full"
              >
                Registrar otro
              </Button>

              <Link href="/my-referrals" className="w-full">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<ArrowRight />}
                  className="w-full"
                >
                  Ver mis referenciaciones
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          /* ============================================ */
          /*  Form state                                  */
          /* ============================================ */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
          >
            <ScrollFadeIn>
              <h1 className="text-xl font-bold text-white mb-1">
                Registrar Prospecto
              </h1>
              <p className="text-sm text-white/50 mb-8">
                Ingresa los datos del nuevo prospecto
              </p>
            </ScrollFadeIn>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <ScrollFadeIn delay={0.05}>
                <Input
                  label="Nombre"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  error={errors.name}
                  required
                />
              </ScrollFadeIn>

              {/* Phone */}
              <ScrollFadeIn delay={0.08}>
                <Input
                  label="Celular"
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  error={
                    errors.contact && !formData.email.trim()
                      ? errors.contact
                      : undefined
                  }
                />
              </ScrollFadeIn>

              {/* Email */}
              <ScrollFadeIn delay={0.11}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={
                    errors.contact && !formData.phone.trim()
                      ? errors.contact
                      : undefined
                  }
                />
              </ScrollFadeIn>

              {/* Client type */}
              <ScrollFadeIn delay={0.14}>
                <Select
                  label="Tipo de cliente"
                  value={formData.clientType}
                  onChange={(e) =>
                    updateField('clientType', e.target.value as ClientType)
                  }
                >
                  {permissions.canReferVIP && (
                    <option value="vip" className="bg-[#111111]">
                      VIP
                    </option>
                  )}
                  {permissions.canReferStandard && (
                    <option value="standard" className="bg-[#111111]">
                      Standard
                    </option>
                  )}
                </Select>
              </ScrollFadeIn>

              {/* Program */}
              <ScrollFadeIn delay={0.17}>
                <Select
                  label="Programa"
                  value={formData.program}
                  onChange={(e) =>
                    updateField('program', e.target.value as OlimpoProgram)
                  }
                >
                  <option value="empresa_eb1" className="bg-[#111111]">
                    Empresa EB 1
                  </option>
                  <option value="empresa_eb2" className="bg-[#111111]">
                    Empresa EB 2
                  </option>
                </Select>
              </ScrollFadeIn>

              {/* Credit toggle (only if agent has permission) */}
              {permissions.canGrantCredit && (
                <ScrollFadeIn delay={0.2}>
                  <div className="flex flex-col gap-4">
                    <Toggle
                      checked={formData.creditAvailable}
                      onChange={(checked) =>
                        updateField('creditAvailable', checked)
                      }
                      label="Credito disponible"
                    />

                    {/* Credit line amount (conditional) */}
                    <AnimatePresence>
                      {formData.creditAvailable && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="overflow-hidden"
                        >
                          <CurrencyInput
                            label="Monto de linea de credito"
                            value={formData.creditLineAmount}
                            onChange={(val) =>
                              updateField('creditLineAmount', val)
                            }
                            error={errors.creditLineAmount}
                            max={permissions.maxCreditLineAmount}
                            hint={`Maximo: ${formatCurrency(permissions.maxCreditLineAmount)}`}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollFadeIn>
              )}

              {/* Submit */}
              <ScrollFadeIn delay={0.25}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  icon={<UserPlus />}
                  className="w-full mt-4"
                >
                  Registrar Prospecto
                </Button>
              </ScrollFadeIn>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
