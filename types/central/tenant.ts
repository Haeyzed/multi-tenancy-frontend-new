export const TenantStatuses = {
  Pending: "pending",
  Active: "active",
  Suspended: "suspended",
  Cancelled: "cancelled",
} as const

export type TenantStatus = (typeof TenantStatuses)[keyof typeof TenantStatuses]

export interface Tenant {
  id: string
  name: string
  slug: string
  database: string
  domain: string
  status: TenantStatus
  plan_id: string | null
  billing_cycle: string | null
  trial_ends_at: string | null
  subscribed_at: string | null
  expires_at: string | null
  owner_email: string
  owner_name: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface TenantFormPayload {
  name: string
  slug: string
  database: string
  domain: string
  status: TenantStatus
  plan_id?: string | null
  billing_cycle: "monthly" | "yearly"
  trial_ends_at?: string | null
  subscribed_at?: string | null
  expires_at?: string | null
  owner_email: string
  owner_name: string
}

export interface MetricCard {
  key: string
  label: string
  value: number | string
}

export interface TenantListParams {
  page?: number
  per_page?: number
  search?: string
}
