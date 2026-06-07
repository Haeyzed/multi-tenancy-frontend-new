import type { MetricCard } from "@/types/central/tenant"

export interface Permission {
  id: number
  name: string
  guard_name: string
  module: string | null
  created_at: string | null
  updated_at: string | null
}

export interface PermissionFormPayload {
  name: string
  guard_name: string
  module?: string | null
}

export interface PermissionListParams {
  page?: number
  per_page?: number
  search?: string
}

export type { MetricCard }
