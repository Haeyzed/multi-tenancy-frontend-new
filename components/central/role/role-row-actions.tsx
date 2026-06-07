"use client"

import { useQueryClient } from "@tanstack/react-query"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
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
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  async function handleDelete() {
    await roleService.delete(role.id)
    await queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(role)}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
