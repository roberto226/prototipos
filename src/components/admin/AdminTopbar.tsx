'use client'

import { usePathname } from 'next/navigation'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------ */
/*  Path-to-title map                                                  */
/* ------------------------------------------------------------------ */

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/agents/new') return 'Nuevo Agente'
  if (pathname.startsWith('/agents/') && pathname !== '/agents') return 'Detalle de Agente'
  if (pathname === '/agents') return 'Agentes'
  if (pathname === '/referrals') return 'Referenciaciones'
  if (pathname === '/commissions') return 'Comisiones'
  return 'Admin'
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminTopbar() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30',
        'flex h-[60px] items-center justify-between',
        'pl-14 lg:pl-[260px] pr-4 lg:pr-6',
        'w-full',
        'bg-[#0a0a0a]/80 backdrop-blur-xl',
        'border-b border-white/[0.06]',
      )}
    >
      {/* Page title */}
      <div className="pl-2 lg:pl-6">
        <h1 className="text-sm font-semibold text-white/85">{title}</h1>
      </div>

      {/* Admin avatar */}
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            'bg-gradient-to-br from-sky-500/20 to-teal-500/20',
            'ring-1 ring-white/[0.08]',
          )}
        >
          <Shield className="h-3.5 w-3.5 text-teal-400" />
        </div>
        <span className="text-xs font-medium text-white/50 hidden sm:inline">Admin</span>
      </div>
    </header>
  )
}
