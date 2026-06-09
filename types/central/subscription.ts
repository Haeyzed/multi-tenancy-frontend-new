import type { MetricCard } from "@/types/central/tenant"

export const SubscriptionStatuses = {
  Trialing: "trialing",
  Active: "active",
  PastDue: "past_due",
  Cancelled: "cancelled",
  Paused: "paused",
  Expired: "expired",
} as const

export type SubscriptionStatus =
  (typeof SubscriptionStatuses)[keyof typeof SubscriptionStatuses]

export const subscriptionStatusLabels: Record<SubscriptionStatus, string> = {
  trialing: "Trialing",
  active: "Active",
  past_due: "Past Due",
  cancelled: "Cancelled",
  paused: "Paused",
  expired: "Expired",
}

export const BillingCycles = {
  Monthly: "monthly",
  Yearly: "yearly",
} as const

export type BillingCycle = (typeof BillingCycles)[keyof typeof BillingCycles]

export interface SubscriptionTenant {
  id: string
  name: string
  slug: string
  domain: string
  status: string
  owner_name: string
  owner_email: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  tier: number
  is_active: boolean
}

export interface SubscriptionInvoice {
  id: string
  invoice_number: string
  status: string
  amount_due: number
  amount_paid: number
  amount_remaining: number
  currency: string
  due_date: string | null
  paid_at: string | null
}

export interface SubscriptionItem {
  id: number
  subscription_id: string
  plan_id: string
  quantity: number
  unit_amount: number
  currency: string
}

export interface SubscriptionUsageRecord {
  id: number
  tenant_id: string
  subscription_id: string | null
  metric: string
  quantity: number
  recorded_at: string | null
}

export interface Subscription {
  id: string
  tenant_id: string
  plan_id: string
  status: SubscriptionStatus
  billing_cycle: BillingCycle
  current_period_start: string | null
  current_period_end: string | null
  trial_ends_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  payment_provider: string | null
  payment_provider_id: string | null
  payment_method_id: string | null
  latest_invoice_id: string | null
  created_at: string | null
  updated_at: string | null
  tenant?: SubscriptionTenant | null
  plan?: SubscriptionPlan | null
  latest_invoice?: SubscriptionInvoice | null
  invoices?: SubscriptionInvoice[]
  subscription_items?: SubscriptionItem[]
  usage_records?: SubscriptionUsageRecord[]
}

export interface SubscriptionListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
}

export type { MetricCard }
