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
import { permissionService } from "@/services/central/permission.service"
import type { Permission } from "@/types/central/permission"

interface PermissionRowActionsProps {
  permission: Permission
  onEdit: (permission: Permission) => void
}

export function PermissionRowActions({
  permission,
  onEdit,
}: PermissionRowActionsProps) {
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  async function handleDelete() {
    await permissionService.delete(permission.id)
    await queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all })
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
          <DropdownMenuItem onClick={() => onEdit(permission)}>
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
        title="Delete permission?"
        description={
          <>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{permission.name}</span>.
            This action cannot be undone.
          </>
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
