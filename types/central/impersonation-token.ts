import type { Tenant } from "@/types/central/tenant"
import type { User } from "@/types/central/user"

export interface ImpersonationToken {
  id: number
  tenant_id: string
  admin_id: number
  expires_at: string
  used_at: string | null
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
  administrator?: User | null
  plain_token?: string
}

export interface ImpersonationTokenFormPayload {
  tenant_id: string
  admin_id: number
  expires_at: string
}

export interface ImpersonationTokenListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
}
