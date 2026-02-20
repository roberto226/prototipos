import type { ReferralStatus, OlimpoProgram, ClientType } from './types'

export const STATUS_LABELS: Record<ReferralStatus, string> = {
  invited: 'Invitado',
  registered: 'Registrado',
  active: 'Activo',
  churn: 'Churn',
}

export const STATUS_COLORS: Record<ReferralStatus, string> = {
  invited: '#A78BFA',
  registered: '#818CF8',
  active: '#34D399',
  churn: '#F87171',
}

export const STATUS_BG_CLASSES: Record<ReferralStatus, string> = {
  invited: 'bg-violet-400/15 text-violet-400',
  registered: 'bg-indigo-400/15 text-indigo-400',
  active: 'bg-emerald-400/15 text-emerald-400',
  churn: 'bg-red-400/15 text-red-400',
}

export const PROGRAM_LABELS: Record<OlimpoProgram, string> = {
  empresa_eb1: 'Empresa EB 1',
  empresa_eb2: 'Empresa EB 2',
}

export const PROGRAM_COLORS: Record<OlimpoProgram, string> = {
  empresa_eb1: '#94A3B8',
  empresa_eb2: '#CBD5E1',
}

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  vip: 'VIP',
  standard: 'Standard',
}

export const CLIENT_TYPE_COLORS: Record<ClientType, string> = {
  vip: '#FFD700',
  standard: '#4FC3F7',
}

export const EASING = [0.16, 1, 0.3, 1] as const

export const NAV_ITEMS_ADMIN = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' as const },
  { label: 'Agentes', href: '/agents', icon: 'Users' as const },
  { label: 'Referenciaciones', href: '/referrals', icon: 'UserPlus' as const },
  { label: 'Comisiones', href: '/commissions', icon: 'Wallet' as const },
]

export const NAV_ITEMS_AGENT = [
  { label: 'Panel', href: '/panel', icon: 'LayoutDashboard' as const },
  { label: 'Registrar', href: '/register', icon: 'UserPlus' as const },
  { label: 'Invitar', href: '/invite', icon: 'Link' as const },
  { label: 'Mis Refs', href: '/my-referrals', icon: 'Users' as const },
]
