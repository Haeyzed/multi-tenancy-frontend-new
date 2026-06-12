"use client"

import { useTenantPermissions } from "@/hooks/use-tenant-permissions"
import type { TenantPermissionName } from "@/lib/tenant/auth/permissions"

interface TenantCanProps {
  permission?: TenantPermissionName | string
  permissions?: Array<TenantPermissionName | string>
  requireAll?: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function TenantCan({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}: TenantCanProps) {
  const { can, canAny, canAll } = useTenantPermissions()

  const allowed = permission
    ? can(permission)
    : permissions
      ? requireAll
        ? canAll(permissions)
        : canAny(permissions)
      : false

  return allowed ? children : fallback
}
