import type { MetricCard } from "@/types/central/tenant"
import type { PlanFeature } from "@/types/central/plan-feature"

export type { PlanFeature }

export interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  tier: number
  is_active: boolean
  is_public: boolean
  price_monthly: number
  price_yearly: number
  currency: string
  trial_days: number
  sort_order: number
  display_features: Record<string, unknown> | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  plan_features?: PlanFeature[]
}

export interface PlanListParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: string
  is_public?: string
}

/** Payload for POST /plans and PUT /plans/{id} */
export interface PlanFormPayload {
  name: string
  slug: string
  description?: string | null
  tier: number
  is_active?: boolean
  is_public?: boolean
  price_monthly: number
  price_yearly: number
  currency: string
  trial_days: number
  sort_order?: number
  features: Record<string, unknown>
}

export type { MetricCard }
