import type { Permission } from "@/types/central/permission"
import type { MetricCard } from "@/types/central/tenant"

export interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string | null
  updated_at: string | null
  permissions?: Permission[]
}

export interface RoleFormPayload {
  name: string
  guard_name: string
}

export interface RoleListParams {
  page?: number
  per_page?: number
  search?: string
}

export type { MetricCard }
