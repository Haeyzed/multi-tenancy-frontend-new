"use client"

import { KeyRoundIcon, PlusIcon } from "lucide-react"
import * as React from "react"

import { PageBreadcrumb } from "@/components/central/page-breadcrumb"
import { RoleFormDialog } from "@/components/central/role/role-form-dialog"
import { RoleMetricCards } from "@/components/central/role/role-metric-cards"
import { RolePermissionsMatrixDialog } from "@/components/central/role/role-permissions-matrix-dialog"
import { RolesDataTable } from "@/components/central/role/roles-data-table"
import { Button } from "@/components/ui/button"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Roles" },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
            <p className="text-sm text-muted-foreground">
              Manage Spatie roles and configure permissions in the matrix.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setMatrixDialogOpen(true)}>
              <KeyRoundIcon />
              Manage permissions
            </Button>
            <Button onClick={openCreate}>
              <PlusIcon />
              Create role
            </Button>
          </div>
        </div>
      </div>

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
    </div>
  )
}
