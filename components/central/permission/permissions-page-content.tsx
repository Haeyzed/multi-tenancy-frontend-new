"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { PermissionFormDialog } from "@/components/central/permission/permission-form-dialog"
import { PermissionMetricCards } from "@/components/central/permission/permission-metric-cards"
import { PermissionsDataTable } from "@/components/central/permission/permissions-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { Permission } from "@/types/central/permission"

export function PermissionsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingPermission, setEditingPermission] =
    React.useState<Permission | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingPermission(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((permission: Permission) => {
    setEditingPermission(permission)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Permissions"
        description="Manage Spatie permissions grouped by functional modules."
      >
        <Can permission={Permissions.permissions.create}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create permission
          </Button>
        </Can>
      </PageHeader>

      <PermissionMetricCards />

      <PermissionsDataTable onEdit={openEdit} />

      <PermissionFormDialog
        permission={editingPermission}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
