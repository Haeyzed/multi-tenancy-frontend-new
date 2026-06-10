import type { MetricCard } from "@/types/central/tenant"
import type { Tenant } from "@/types/central/tenant"

export interface ApiKey {
  id: number
  tenant_id: string
  name: string
  permissions: string[] | null
  last_used_at: string | null
  expires_at: string | null
  is_active: boolean
  plain_key?: string | null
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
}

export interface ApiKeyFormPayload {
  tenant_id: string
  name: string
  expires_at?: string | null
  permissions?: string[] | null
  is_active?: boolean
}

export interface ApiKeyListParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: string
}

export type { MetricCard }
