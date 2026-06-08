"use client"

import { KeyRoundIcon, PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { RoleFormDialog } from "@/components/central/role/role-form-dialog"
import { RoleMetricCards } from "@/components/central/role/role-metric-cards"
import { RolePermissionsMatrixDialog } from "@/components/central/role/role-permissions-matrix-dialog"
import { RolesDataTable } from "@/components/central/role/roles-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { Role } from "@/types/central/role"

export function RolesPageContent() {
  const [formDialogOpen, setFormDialogOpen] = React.useState(false)
  const [matrixDialogOpen, setMatrixDialogOpen] = React.useState(false)
  const [editingRole, setEditingRole] = React.useState<Role | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingRole(null)
    setFormDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((role: Role) => {
    setEditingRole(role)
    setFormDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Roles"
        description="Manage Spatie roles and configure permissions in the matrix."
      >
        <div className="flex flex-wrap gap-2">
          <Can permission={Permissions.roles.update}>
            <Button variant="outline" onClick={() => setMatrixDialogOpen(true)}>
              <KeyRoundIcon />
              Manage permissions
            </Button>
          </Can>
          <Can permission={Permissions.roles.create}>
            <Button onClick={openCreate}>
              <PlusIcon />
              Create role
            </Button>
          </Can>
        </div>
      </PageHeader>

      <RoleMetricCards />

      <RolesDataTable onEdit={openEdit} />

      <RoleFormDialog
        role={editingRole}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
      />

      <RolePermissionsMatrixDialog
        open={matrixDialogOpen}
        onOpenChange={setMatrixDialogOpen}
      />
    </>
  )
}
