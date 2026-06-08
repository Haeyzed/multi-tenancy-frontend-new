"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { UserFormDialog } from "@/components/central/user/user-form-dialog"
import { UserMetricCards } from "@/components/central/user/user-metric-cards"
import { UsersDataTable } from "@/components/central/user/users-data-table"
import { PageHeader } from "@/components/layout/page-header"
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
    <>
      <PageHeader
        title="Users"
        description="Manage platform administrators, roles, and permissions."
      >
        <Can permission={Permissions.users.create}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create user
          </Button>
        </Can>
      </PageHeader>

      <UserMetricCards />

      <UsersDataTable onEdit={openEdit} />

      <UserFormDialog
        user={editingUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
