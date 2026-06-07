"use client"

import { usePathname } from "next/navigation"

import { ForbiddenState } from "@/components/central/forbidden-state"
import { usePermissions } from "@/hooks/use-permissions"
import { useAuth } from "@/providers/central/auth-provider"
import {
  getRoutePermission,
  type PermissionName,
} from "@/lib/central/auth/permissions"

interface PermissionGuardProps {
  permission?: PermissionName | string | null
  permissions?: Array<PermissionName | string>
  requireAll?: boolean
  children: React.ReactNode
}

export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  children,
}: PermissionGuardProps) {
  const pathname = usePathname()
  const { isLoading } = useAuth()
  const { can, canAny, canAll } = usePermissions()

  const requiredPermission = permission ?? getRoutePermission(pathname)

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
