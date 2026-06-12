"use client"

import { CommandMenuDialog } from "@/components/shared/command-menu-dialog"
import { usePermissions } from "@/hooks/use-permissions"
import { centralNavSearchItems } from "@/lib/central/navigation/search-items"

export function CommandMenu() {
  const { can } = usePermissions()

  return (
    <CommandMenuDialog
      items={centralNavSearchItems}
      canAccess={(permission) => can(permission)}
    />
  )
}
