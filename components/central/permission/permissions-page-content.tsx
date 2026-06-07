"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { PageBreadcrumb } from "@/components/central/page-breadcrumb"
import { PermissionFormDialog } from "@/components/central/permission/permission-form-dialog"
import { PermissionMetricCards } from "@/components/central/permission/permission-metric-cards"
import { PermissionsDataTable } from "@/components/central/permission/permissions-data-table"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Permissions" },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
            <p className="text-sm text-muted-foreground">
              Manage Spatie permissions grouped by functional modules.
            </p>
          </div>
          <Can permission={Permissions.permissions.create}>
            <Button onClick={openCreate}>
              <PlusIcon />
              Create permission
            </Button>
          </Can>
        </div>
      </div>

      <PermissionMetricCards />

      <PermissionsDataTable onEdit={openEdit} />

      <PermissionFormDialog
        permission={editingPermission}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
