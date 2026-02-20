export type ClientType = 'vip' | 'standard'
export type ReferralStatus = 'invited' | 'registered' | 'active' | 'churn'
export type CommissionStatus = 'pending' | 'paid'
export type OlimpoProgram = 'empresa_eb1' | 'empresa_eb2'
export type AgentStatus = 'active' | 'inactive'

export interface AgentPermissions {
  canReferVIP: boolean
  canReferStandard: boolean
  canGrantCredit: boolean
  maxCreditLineAmount: number
}

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  avatarUrl?: string
  status: AgentStatus
  permissions: AgentPermissions
  createdAt: string
}

export interface StatusHistoryEntry {
  status: ReferralStatus
  timestamp: string
}

export interface Prospect {
  id: string
  name: string
  phone?: string
  email?: string
  clientType: ClientType
  creditAvailable: boolean
  creditLineAmount: number
  program: OlimpoProgram
  referredByAgentId: string
  referralMethod: 'direct' | 'invite_link'
  inviteLinkId?: string
  status: ReferralStatus
  statusHistory: StatusHistoryEntry[]
  createdAt: string
}

export interface Transaction {
  id: string
  prospectId: string
  agentId: string
  type: 'funding' | 'card_purchase'
  amount: number
  description: string
  createdAt: string
}

export interface Commission {
  id: string
  agentId: string
  prospectId: string
  transactionId?: string
  amount: number
  rate: number
  status: CommissionStatus
  period: string
  paidAt?: string
  createdAt: string
}

export interface InviteLink {
  id: string
  agentId: string
  code: string
  url: string
  program: OlimpoProgram
  clientType: ClientType
  creditAvailable: boolean
  creditLineAmount: number
  usedByProspectId?: string
  usedAt?: string
  createdAt: string
  expiresAt: string
}

export interface AgentStats {
  totalReferrals: number
  invited: number
  registered: number
  active: number
  churn: number
  totalFunding: number
  totalPurchases: number
  commissionGenerated: number
  commissionPaid: number
}

export interface DashboardFilters {
  dateFrom?: string
  dateTo?: string
  clientType?: ClientType | 'all'
  program?: OlimpoProgram | 'all'
}
