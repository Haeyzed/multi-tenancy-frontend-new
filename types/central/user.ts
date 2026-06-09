import type { MetricCard } from "@/types/central/tenant"

export interface UserPermission {
  id: number
  name: string
  guard_name: string
  module: string | null
  created_at: string | null
  updated_at: string | null
}

export interface UserRoleRecord {
  id: number
  name: string
  guard_name: string
  created_at: string | null
  updated_at: string | null
  permissions?: UserPermission[]
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  last_login_at: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  roles?: UserRoleRecord[]
  permissions?: UserPermission[]
}

export interface UserListParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: string
}

export interface UserFormPayload {
  name: string
  email: string
  password?: string
  is_active?: boolean
  role_ids?: number[]
  permission_ids?: number[]
}

export type { MetricCard }
