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
import { announcementService } from "@/services/central/announcement.service"
import type { PlatformAnnouncement } from "@/types/central/announcement"

interface AnnouncementRowActionsProps {
  announcement: PlatformAnnouncement
  onEdit: (announcement: PlatformAnnouncement) => void
}

export function AnnouncementRowActions({
  announcement,
  onEdit,
}: AnnouncementRowActionsProps) {
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  async function handleDelete() {
    await announcementService.delete(announcement.id)
    await queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all })
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
          <DropdownMenuItem onSelect={() => onEdit(announcement)}>
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
        title="Delete announcement?"
        description={
          <>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {announcement.title}
            </span>
            . This action cannot be undone.
          </>
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
