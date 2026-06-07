import type { MetricCard } from "@/types/central/tenant"

export interface DashboardMetricCard extends MetricCard {
  module: string
}

export interface DashboardDatePoint {
  date: string
  count?: number
  revenue?: number
}

export interface DashboardStatusPoint {
  status: string
  label: string
  count: number
}

export interface DashboardCharts {
  tenant_growth?: DashboardDatePoint[]
  tenant_status?: DashboardStatusPoint[]
  revenue_over_time?: DashboardDatePoint[]
  subscription_status?: DashboardStatusPoint[]
}

export interface DashboardRecentTenant {
  id: string
  name: string
  status: string
  plan: string | null
  owner_email: string
  created_at: string | null
}

export interface DashboardRecentSubscription {
  id: string
  tenant: string | null
  plan: string | null
  status: string
  billing_cycle: string
  created_at: string | null
}

export interface DashboardRecentPayment {
  id: string
  tenant: string | null
  amount: string
  status: string
  provider: string
  created_at: string | null
}

export interface DashboardRecentActivity {
  id: number
  description: string
  event: string | null
  subject_type: string | null
  created_at: string | null
}

export interface DashboardRecentSupportTicket {
  id: number
  subject: string
  tenant: string | null
  status: string
  priority: string
  updated_at: string | null
}

export interface DashboardRecent {
  tenants?: DashboardRecentTenant[]
  subscriptions?: DashboardRecentSubscription[]
  payments?: DashboardRecentPayment[]
  activities?: DashboardRecentActivity[]
  support_tickets?: DashboardRecentSupportTicket[]
}

export interface DashboardOverview {
  cards: DashboardMetricCard[]
  charts: DashboardCharts
  recent: DashboardRecent
}
