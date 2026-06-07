"use client"

import { usePermissions } from "@/hooks/use-permissions"
import type { PermissionName } from "@/lib/central/auth/permissions"

interface CanProps {
  permission?: PermissionName | string
  permissions?: Array<PermissionName | string>
  requireAll?: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function Can({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}: CanProps) {
  const { can, canAny, canAll } = usePermissions()

  const allowed = permission
    ? can(permission)
    : permissions
      ? requireAll
        ? canAll(permissions)
        : canAny(permissions)
      : false

  return allowed ? children : fallback
}
