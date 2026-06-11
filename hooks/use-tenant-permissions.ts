"use client"

import { useTenantAuth } from "@/providers/tenant/auth-provider"
import {
  hasAllTenantPermissions,
  hasAnyTenantPermission,
  hasTenantPermission,
  type TenantPermissionName,
} from "@/lib/tenant/auth/permissions"

export function useTenantPermissions() {
  const { user, isLoading } = useTenantAuth()

  return {
    user,
    isLoading,
    isStoreOwner: user?.is_store_owner ?? false,
    can: (permission: TenantPermissionName | string) =>
      hasTenantPermission(user, permission),
    canAny: (permissions: Array<TenantPermissionName | string>) =>
      hasAnyTenantPermission(user, permissions),
    canAll: (permissions: Array<TenantPermissionName | string>) =>
      hasAllTenantPermissions(user, permissions),
  }
}
