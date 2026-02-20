import type { ReactNode } from 'react'
import AgentHeader from '@/components/agent/AgentHeader'
import AgentBottomNav from '@/components/agent/AgentBottomNav'
import { ToastProvider } from '@/components/ui/toast'

export default function AgentLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[#0a0a0a]">
        {/* Elegant radial gradient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 w-[600px] h-[500px] -translate-x-1/2 opacity-[0.05]"
            style={{ background: 'radial-gradient(ellipse at center top, #94A3B8 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-[20%] left-0 w-[400px] h-[400px] opacity-[0.025]"
            style={{ background: 'radial-gradient(circle, #64748B 0%, transparent 70%)' }}
          />
        </div>

        <AgentHeader />

        <main className="relative z-10 mx-auto max-w-[480px] px-4 pt-14 pb-20 overflow-x-hidden">
          {children}
        </main>

        <AgentBottomNav />
      </div>
    </ToastProvider>
  )
}
