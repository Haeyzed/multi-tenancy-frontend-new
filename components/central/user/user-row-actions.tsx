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
import { userService } from "@/services/central/user.service"
import type { User } from "@/types/central/user"

interface UserRowActionsProps {
  user: User
  onEdit: (user: User) => void
}

export function UserRowActions({ user, onEdit }: UserRowActionsProps) {
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  async function handleDelete() {
    await userService.delete(user.id)
    await queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
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
          <DropdownMenuItem onSelect={() => onEdit(user)}>
            <PencilIcon />
            Edit
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

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete user?"
        description={
          <>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{user.name}</span> (
            {user.email}). This action cannot be undone.
          </>
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
