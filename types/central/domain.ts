import type { Tenant } from "@/types/central/tenant"

export interface Domain {
  id: number
  tenant_id: string
  domain: string
  is_primary: boolean
  is_fallback: boolean
  verified: boolean
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
}

export interface DomainFormPayload {
  tenant_id: string
  domain: string
  is_primary?: boolean
  is_fallback?: boolean
  verified?: boolean
}

export interface DomainListParams {
  page?: number
  per_page?: number
  search?: string
  verified?: string
}
