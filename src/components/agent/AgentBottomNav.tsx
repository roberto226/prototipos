'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UserPlus, Link as LinkIcon, Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { NAV_ITEMS_AGENT } from '@/lib/constants'

/* ------------------------------------------------------------------ */
/*  Icon map                                                           */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard,
  UserPlus,
  Link: LinkIcon,
  Users,
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AgentBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-[#0e0e0e]/90 backdrop-blur-xl',
        'border-t border-white/[0.06]',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-around px-2">
        {NAV_ITEMS_AGENT.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = iconMap[item.icon]

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                'min-w-[56px] py-1 px-2 rounded-xl',
                'transition-colors duration-200',
                isActive
                  ? 'text-white/90'
                  : 'text-white/40 active:text-white/60',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-colors duration-200',
                  isActive ? 'text-white/90' : 'text-white/40',
                )}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={cn(
                  'text-[10px] font-semibold leading-none',
                  isActive
                    ? 'text-white/90'
                    : 'text-white/40',
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Safe area spacing for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
