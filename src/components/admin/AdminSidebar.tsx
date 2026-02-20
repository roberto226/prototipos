'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, UserPlus, Wallet, Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { NAV_ITEMS_ADMIN } from '@/lib/constants'
import OlimpoLogo from '@/components/shared/OlimpoLogo'

/* ------------------------------------------------------------------ */
/*  Icon map                                                           */
/* ------------------------------------------------------------------ */

const iconMap = {
  LayoutDashboard,
  Users,
  UserPlus,
  Wallet,
} as const

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-6">
        <OlimpoLogo size="sm" />
        {/* Close button on mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {NAV_ITEMS_ADMIN.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5',
                'text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/[0.06] text-white'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]',
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom label */}
      <div className="px-6 py-5">
        <span className="text-[11px] font-medium text-white/20 uppercase tracking-wider">
          Olimpo Referrals Admin
        </span>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className={cn(
          'fixed top-4 left-4 z-50 lg:hidden',
          'flex items-center justify-center h-9 w-9 rounded-xl',
          'bg-[#111111] border border-white/[0.08]',
          'text-white/60 hover:text-white/90 transition-colors',
        )}
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40',
          'hidden lg:flex h-screen w-[260px] flex-col',
          'bg-[#0e0e0e] border-r border-white/[0.06]',
        )}
      >
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 lg:hidden',
          'flex h-screen w-[280px] flex-col',
          'bg-[#0e0e0e] border-r border-white/[0.06]',
          'transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {navContent}
      </aside>
    </>
  )
}
