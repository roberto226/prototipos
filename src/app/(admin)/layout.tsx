import { ToastProvider } from '@/components/ui/toast'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[#0a0a0a]">
        {/* Elegant radial gradient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-[50%] w-[1200px] h-[800px] -translate-x-1/2 opacity-[0.04]"
            style={{ background: 'radial-gradient(ellipse at center top, #94A3B8 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-[0.02]"
            style={{ background: 'radial-gradient(circle at bottom right, #64748B 0%, transparent 70%)' }}
          />
        </div>

        <AdminSidebar />
        <AdminTopbar />

        {/* Main content area */}
        <main className="relative z-10 lg:pl-[260px] pt-[60px]">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ToastProvider>
  )
}
