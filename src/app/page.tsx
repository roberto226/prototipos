'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutGrid,
  Users,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const ease = [0.16, 1, 0.3, 1] as const

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const cards = [
  {
    title: 'Admin Panel',
    subtitle: 'Gestión centralizada, monitoreo de agentes, comisiones y funnel de conversión.',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Agent Portal',
    subtitle: 'Registra prospectos, genera links de invitación y gestiona tus referenciaciones.',
    href: '/panel',
    icon: Users,
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background: subtle teal ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #5EEAD4 0%, transparent 70%)' }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-10 px-6 py-16 max-w-2xl w-full"
      >
        {/* Title block */}
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="olimpo-text">Olimpo</span>{' '}
            <span className="text-white/90">Referrals</span>
          </h1>
        </motion.div>

        {/* Prototype badge */}
        <motion.div variants={fadeUp}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/[0.08] border border-teal-500/[0.12]">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-medium text-teal-400/80 tracking-wide uppercase">
              Prototipo Interactivo
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="text-center text-sm text-white/30 leading-relaxed max-w-lg"
        >
          Este es un prototipo funcional del sistema de referenciaciones Olimpo.
          Selecciona uno de los portales para explorar la experiencia completa.
        </motion.p>

        {/* Portal cards */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-2"
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.href}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease }}
            >
              <Link href={card.href}>
                <div className="group relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-7 hover:border-teal-500/20 transition-all duration-500 cursor-pointer overflow-hidden">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/[0.08] border border-teal-500/[0.1] mb-5 group-hover:border-teal-500/20 transition-colors duration-500">
                      <card.icon className="w-4.5 h-4.5 text-teal-400/70 group-hover:text-teal-400 transition-colors duration-500" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-lg font-semibold text-white/90 mb-2 tracking-tight">
                      {card.title}
                    </h2>
                    <p className="text-white/35 text-sm leading-relaxed mb-6">
                      {card.subtitle}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-teal-400/60 group-hover:text-teal-400 transition-colors duration-500">
                      <span>Explorar</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-3 pt-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-white/15 text-[11px] tracking-wider font-medium uppercase">
            Olimpo Referrals v1.0 · Prototipo
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
