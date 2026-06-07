"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { PageBreadcrumb } from "@/components/central/page-breadcrumb"
import { UserFormDialog } from "@/components/central/user/user-form-dialog"
import { UserMetricCards } from "@/components/central/user/user-metric-cards"
import { UsersDataTable } from "@/components/central/user/users-data-table"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { User } from "@/types/central/user"

export function UsersPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingUser(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Users" },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage platform administrators, roles, and permissions.
            </p>
          </div>
          <Can permission={Permissions.users.create}>
            <Button onClick={openCreate}>
              <PlusIcon />
              Create user
            </Button>
          </Can>
        </div>
      </div>

      <UserMetricCards />

      <UsersDataTable onEdit={openEdit} />

      <UserFormDialog
        user={editingUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
