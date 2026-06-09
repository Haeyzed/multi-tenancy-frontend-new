import type { Tenant } from "@/types/central/tenant"

export interface TenantConfig {
  id: number
  tenant_id: string
  key: string
  value: string | null
  encrypted: boolean
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
}

export interface TenantConfigFormPayload {
  tenant_id: string
  key: string
  value?: string | null
  encrypted?: boolean
}

export interface TenantConfigListParams {
  page?: number
  per_page?: number
  search?: string
}
