'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link as LinkIcon,
  Copy,
  Check,
  MessageCircle,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Toggle } from '@/components/ui/toggle'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ScrollFadeIn from '@/components/shared/ScrollFadeIn'
import { useToast } from '@/components/ui/toast'
import { getAgentById, getInviteLinksByAgent, prospects } from '@/lib/mock-data'
import {
  PROGRAM_LABELS,
  PROGRAM_COLORS,
  CLIENT_TYPE_LABELS,
} from '@/lib/constants'
import {
  formatCurrency,
  formatDate,
  formatDateShort,
} from '@/lib/formatters'
import {
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function InvitePage() {
  const agent = getAgentById(AGENT_ID)!
  const { permissions } = agent
  const existingLinks = getInviteLinksByAgent(AGENT_ID)
  const { toast } = useToast()

  /* ------ Config state ------ */
  const [clientType, setClientType] = useState<ClientType>(
    permissions.canReferVIP ? 'vip' : 'standard',
  )
  const [program, setProgram] = useState<OlimpoProgram>('empresa_eb1')
  const [creditAvailable, setCreditAvailable] = useState(false)
  const [creditLineAmount, setCreditLineAmount] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  /* ------ Generated link state ------ */
  const [generatedLink, setGeneratedLink] = useState<{
    code: string
    url: string
  } | null>(null)

  const [copied, setCopied] = useState(false)

  /* ------ Handlers ------ */

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600))

    const code = generateInviteCode()
    const url = generateInviteUrl(code)

    setGeneratedLink({ code, url })
    setIsGenerating(false)
  }, [])

  const handleCopy = useCallback(
    async (url: string) => {
      await copyToClipboard(url)
      setCopied(true)
      toast({ variant: 'success', message: 'Link copiado al portapapeles' })
      setTimeout(() => setCopied(false), 2000)
    },
    [toast],
  )

  const handleWhatsApp = useCallback((url: string) => {
    const shareUrl = getWhatsAppShareUrl(url, 'Te invito a unirte a Olimpo:')
    window.open(shareUrl, '_blank')
  }, [])

  const handleSms = useCallback((url: string) => {
    const shareUrl = getSmsShareUrl(url, 'Te invito a unirte a Olimpo:')
    window.open(shareUrl, '_blank')
  }, [])

  /* ------ Existing links sorted by date ------ */
  const sortedLinks = useMemo(
    () =>
      [...existingLinks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [existingLinks],
  )

  /* ------ Render ------ */

  return (
    <div className="relative py-6 flex flex-col gap-8">
      {/* Title */}
      <ScrollFadeIn>
        <h1 className="text-xl font-bold text-white mb-1">
          Generar Link de Invitacion
        </h1>
        <p className="text-sm text-white/50">
          Crea un link personalizado para compartir
        </p>
      </ScrollFadeIn>

      {/* Configuration section */}
      <ScrollFadeIn delay={0.05}>
        <Card padding="md">
          <div className="flex flex-col gap-5">
            {/* Client type */}
            <Select
              label="Tipo de cliente"
              value={clientType}
              onChange={(e) => setClientType(e.target.value as ClientType)}
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

            {/* Program */}
            <Select
              label="Programa"
              value={program}
              onChange={(e) => setProgram(e.target.value as OlimpoProgram)}
            >
              <option value="empresa_eb1" className="bg-[#111111]">
                Empresa EB 1
              </option>
              <option value="empresa_eb2" className="bg-[#111111]">
                Empresa EB 2
              </option>
            </Select>

            {/* Credit toggle */}
            {permissions.canGrantCredit && (
              <div className="flex flex-col gap-4">
                <Toggle
                  checked={creditAvailable}
                  onChange={setCreditAvailable}
                  label="Credito disponible"
                />

                <AnimatePresence>
                  {creditAvailable && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <CurrencyInput
                        label="Monto de linea"
                        value={creditLineAmount}
                        onChange={setCreditLineAmount}
                        max={permissions.maxCreditLineAmount}
                        hint={`Maximo: ${formatCurrency(permissions.maxCreditLineAmount)}`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              variant="primary"
              size="lg"
              loading={isGenerating}
              icon={<LinkIcon />}
              className="w-full"
            >
              Generar Link
            </Button>
          </div>
        </Card>
      </ScrollFadeIn>

      {/* Generated link card */}
      <AnimatePresence>
        {generatedLink && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.4, ease }}
          >
            <Card padding="md" className="flex flex-col gap-5">
              {/* URL display */}
              <div>
                <span className="text-xs text-white/40 font-medium mb-2 block">
                  Tu link de invitacion
                </span>
                <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3">
                  <code className="flex-1 text-sm text-teal-400 font-mono truncate">
                    {generatedLink.url}
                  </code>
                  <button
                    onClick={() => handleCopy(generatedLink.url)}
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
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleWhatsApp(generatedLink.url)}
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
                  onClick={() => handleSms(generatedLink.url)}
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
                  onClick={() => handleCopy(generatedLink.url)}
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

              {/* Expiration */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                <Clock className="h-3.5 w-3.5" />
                <span>Valido por 30 dias</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History section */}
      {sortedLinks.length > 0 && (
        <ScrollFadeIn delay={0.1}>
          <h2 className="text-sm font-semibold text-white/85 mb-4">
            Links anteriores
          </h2>

          <div className="flex flex-col gap-3">
            {sortedLinks.map((link, idx) => {
              const isUsed = !!link.usedByProspectId
              const usedByProspect = isUsed
                ? prospects.find((p) => p.id === link.usedByProspectId)
                : null
              const isExpired =
                !isUsed && new Date(link.expiresAt) < new Date()

              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease,
                    delay: idx * 0.05,
                  }}
                >
                  <Card padding="sm" className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <code className="text-xs font-mono text-white/60 bg-white/[0.04] px-2 py-1 rounded-md">
                        {link.code}
                      </code>
                      <div className="flex items-center gap-1.5">
                        {isUsed ? (
                          <Badge variant="success">Usado</Badge>
                        ) : isExpired ? (
                          <Badge variant="warning">Expirado</Badge>
                        ) : (
                          <Badge variant="info">Activo</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className="font-medium"
                        style={{
                          color: PROGRAM_COLORS[link.program],
                        }}
                      >
                        {PROGRAM_LABELS[link.program]}
                      </span>
                      <span className="text-white/15">|</span>
                      <span className="text-white/50">
                        {CLIENT_TYPE_LABELS[link.clientType]}
                      </span>
                      <span className="text-white/15">|</span>
                      <span className="text-white/40">
                        {formatDateShort(link.createdAt)}
                      </span>
                    </div>

                    {usedByProspect && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-white/40 pt-3 border-t border-white/[0.04]">
                        <span>Usado por</span>
                        <span className="font-medium text-white/70">
                          {usedByProspect.name}
                        </span>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </ScrollFadeIn>
      )}
    </div>
  )
}
