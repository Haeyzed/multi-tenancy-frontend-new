"use client"

import { usePathname } from "next/navigation"

import { ForbiddenState } from "@/components/central/forbidden-state"
import { useTenantPermissions } from "@/hooks/use-tenant-permissions"
import { useTenantAuth } from "@/providers/tenant/auth-provider"
import {
  getTenantRoutePermission,
  type TenantPermissionName,
} from "@/lib/tenant/auth/permissions"

interface TenantPermissionGuardProps {
  permission?: TenantPermissionName | string | null
  permissions?: Array<TenantPermissionName | string>
  requireAll?: boolean
  children: React.ReactNode
}

export function TenantPermissionGuard({
  permission,
  permissions,
  requireAll = false,
  children,
}: TenantPermissionGuardProps) {
  const pathname = usePathname()
  const { isLoading } = useTenantAuth()
  const { can, canAny, canAll } = useTenantPermissions()

  const requiredPermission = permission ?? getTenantRoutePermission(pathname)

  if (isLoading) {
    return null
  }

  if (requiredPermission === null && !permissions) {
    return children
  }

  const allowed = permissions
    ? requireAll
      ? canAll(permissions)
      : canAny(permissions)
    : requiredPermission
      ? can(requiredPermission)
      : true

  if (!allowed) {
    return <ForbiddenState />
  }

  return children
}
