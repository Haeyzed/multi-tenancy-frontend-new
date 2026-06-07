"use client"

import { useAuth } from "@/providers/central/auth-provider"
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  type PermissionName,
} from "@/lib/central/auth/permissions"

export function usePermissions() {
  const { user, isLoading } = useAuth()

  return {
    user,
    isLoading,
    isSuperAdmin: user?.is_super_admin ?? false,
    can: (permission: PermissionName | string) => hasPermission(user, permission),
    canAny: (permissions: Array<PermissionName | string>) =>
      hasAnyPermission(user, permissions),
    canAll: (permissions: Array<PermissionName | string>) =>
      hasAllPermissions(user, permissions),
  }
}
