'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { MonthlyMetric } from '@/lib/mock-data'

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

type MetricKey = 'commissions' | 'referrals' | 'activations' | 'funding'

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: 'commissions', label: 'Comisiones', color: '#34D399' },
  { key: 'referrals', label: 'Referidos', color: '#A78BFA' },
  { key: 'activations', label: 'Activaciones', color: '#38BDF8' },
  { key: 'funding', label: 'Dispersión', color: '#FBBF24' },
]

const ease = [0.16, 1, 0.3, 1] as const

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtValue(key: MetricKey, v: number): string {
  if (key === 'commissions' || key === 'funding') {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(v)
  }
  return v.toString()
}

/** Smooth cubic-bézier through an array of points */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1]
    const c = pts[i]
    const t = 0.3
    d += ` C ${p.x + (c.x - p.x) * t} ${p.y}, ${c.x - (c.x - p.x) * t} ${c.y}, ${c.x} ${c.y}`
  }
  return d
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MetricsChart({ data }: { data: MonthlyMetric[] }) {
  const [active, setActive] = useState<MetricKey>('commissions')
  const config = METRICS.find((m) => m.key === active)!

  const values = data.map((d) => d[active])
  const max = Math.max(...values, 1)
  const current = values[values.length - 1] ?? 0
  const prev = values[values.length - 2] ?? 0
  const pct =
    prev > 0
      ? Math.round(((current - prev) / prev) * 100)
      : current > 0
        ? 100
        : 0

  /* SVG layout */
  const W = 320
  const H = 120
  const P = { t: 8, b: 4, l: 16, r: 16 }
  const cW = W - P.l - P.r
  const cH = H - P.t - P.b

  const pts = values.map((v, i) => ({
    x: P.l + (i / Math.max(values.length - 1, 1)) * cW,
    y: P.t + cH - (v / max) * cH * 0.88,
  }))

  const line = smoothPath(pts)
  const area =
    pts.length >= 2
      ? `${line} L ${pts[pts.length - 1].x} ${P.t + cH} L ${pts[0].x} ${P.t + cH} Z`
      : ''

  const gridY = [0.25, 0.5, 0.75].map((f) => P.t + cH * (1 - f * 0.88))

  return (
    <div>
      {/* ── Metric pills ─────────────────────────────────────────── */}
      <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-0.5">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            className={`relative shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors duration-200 ${
              active === m.key
                ? 'text-white'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            {active === m.key && (
              <motion.div
                layoutId="metric-pill"
                className="absolute inset-0 rounded-full bg-white/[0.07] border border-white/[0.06]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Current value + change ────────────────────────────────── */}
      <div className="flex items-baseline gap-3 mb-4">
        <motion.span
          key={`${active}-val`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="text-2xl font-bold text-white tabular-nums tracking-tight"
        >
          {fmtValue(active, current)}
        </motion.span>

        {pct !== 0 && (
          <motion.span
            key={`${active}-pct`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-0.5 text-[11px] font-medium ${
              pct > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {pct > 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {pct > 0 ? '+' : ''}
            {pct}%
          </motion.span>
        )}

        <span className="text-[10px] text-white/25">vs mes anterior</span>
      </div>

      {/* ── SVG Chart ─────────────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradients – all defined up-front so transitions are seamless */}
        <defs>
          {METRICS.map((m) => (
            <linearGradient
              key={m.key}
              id={`cg-${m.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={m.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={m.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Horizontal grid */}
        {gridY.map((y, i) => (
          <line
            key={i}
            x1={P.l}
            y1={y}
            x2={W - P.r}
            y2={y}
            stroke="rgba(255,255,255,0.03)"
            strokeDasharray="3 3"
          />
        ))}

        {/* Area fill */}
        <motion.path
          key={`area-${active}`}
          d={area}
          fill={`url(#cg-${active})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Line */}
        <motion.path
          key={`line-${active}`}
          d={line}
          stroke={config.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Data-point dots */}
        {pts.map((pt, i) => (
          <motion.circle
            key={`d-${active}-${i}`}
            cx={pt.x}
            cy={pt.y}
            r={i === pts.length - 1 ? 4 : 3}
            fill={i === pts.length - 1 ? config.color : '#111111'}
            stroke={config.color}
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2 + i * 0.06,
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
          />
        ))}
      </svg>

      {/* ── Month labels ──────────────────────────────────────────── */}
      <div className="flex justify-between px-2 mt-1.5">
        {data.map((d, i) => (
          <span
            key={i}
            className={`text-[10px] tabular-nums ${
              i === data.length - 1
                ? 'text-white/50 font-medium'
                : 'text-white/20'
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
