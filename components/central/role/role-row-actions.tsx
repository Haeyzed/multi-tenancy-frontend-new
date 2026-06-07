"use client"

import { useQueryClient } from "@tanstack/react-query"
import { KeyRoundIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { RolePermissionsDialog } from "@/components/central/role/role-permissions-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { queryKeys } from "@/lib/central/query/keys"
import { roleService } from "@/services/central/role.service"
import type { Role } from "@/types/central/role"

interface RoleRowActionsProps {
  role: Role
  onEdit: (role: Role) => void
}

export function RoleRowActions({ role, onEdit }: RoleRowActionsProps) {
  const queryClient = useQueryClient()
  const [permissionsOpen, setPermissionsOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  async function handleDelete() {
    await roleService.delete(role.id)
    await queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onEdit(role)}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPermissionsOpen(true)}>
            <KeyRoundIcon />
            Manage permissions
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RolePermissionsDialog
        role={role}
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete role?"
        description={
          <>
            This will permanently delete the{" "}
            <span className="font-medium text-foreground">{role.name}</span> role.
            This action cannot be undone.
          </>
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
