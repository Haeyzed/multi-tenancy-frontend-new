"use client"

import { CommandMenuDialog } from "@/components/shared/command-menu-dialog"
import { useTenantPermissions } from "@/hooks/use-tenant-permissions"
import { tenantNavSearchItems } from "@/lib/tenant/navigation/search-items"

export function TenantCommandMenu() {
  const { can } = useTenantPermissions()

  return (
    <CommandMenuDialog
      items={tenantNavSearchItems}
      canAccess={(permission) => can(permission)}
    />
  )
}
