'use client'

import { usePathname } from 'next/navigation'
import OlimpoLogo from '@/components/shared/OlimpoLogo'
import { Avatar } from '@/components/ui/avatar'
import { StatusDot } from '@/components/ui/status-dot'
import { NAV_ITEMS_AGENT } from '@/lib/constants'
import { getAgentById } from '@/lib/mock-data'

const AGENT_ID = 'agent-001'

export default function AgentHeader() {
  const pathname = usePathname()
  const agent = getAgentById(AGENT_ID)!

  const currentNav = NAV_ITEMS_AGENT.find((item) => pathname.startsWith(item.href))
  const pageTitle = currentNav?.label ?? 'Panel'

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#0e0e0e] border-b border-white/[0.06]">
      <div className="mx-auto flex h-full max-w-[480px] items-center justify-between px-4">
        {/* Left: Logo */}
        <OlimpoLogo size="sm" showText={false} />

        {/* Center: Page title */}
        <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white/85">
          {pageTitle}
        </span>

        {/* Right: Avatar + Live dot */}
        <div className="flex items-center gap-2.5">
          <StatusDot color="green" pulse size="sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 font-medium hidden min-[360px]:block">
              {agent.name.split(' ')[0]}
            </span>
            <Avatar name={agent.name} size="sm" />
          </div>
        </div>
      </div>
    </header>
  )
}
