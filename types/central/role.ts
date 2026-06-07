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

export interface RoleMatrixPermission {
  id: number
  name: string
  guard_name: string
}

export interface RoleMatrixPermissionGroup {
  module: string
  permissions: RoleMatrixPermission[]
}

export interface RoleMatrixRole {
  id: number
  name: string
  guard_name: string
  permission_ids: number[]
  is_system: boolean
}

export interface RolePermissionsMatrix {
  guard_name: string
  total_permissions: number
  roles: RoleMatrixRole[]
  permission_groups: RoleMatrixPermissionGroup[]
}

export interface RolePermissionsMatrixSyncPayload {
  roles: Array<{
    role_id: number
    permission_ids: number[]
  }>
}

export type { MetricCard }
