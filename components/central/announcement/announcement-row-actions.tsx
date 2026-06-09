"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { RecordViewDialog } from "@/components/central/record-view-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePermissions } from "@/hooks/use-permissions"
import { Permissions } from "@/lib/central/auth/permissions"
import { getAnnouncementViewFields } from "@/lib/central/view/view-fields"
import { toastApiMessage } from "@/lib/central/api/toast"
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
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.platform.view)
  const canManage = can(Permissions.platform.manage)

  async function handleDelete() {
    const result = await announcementService.delete(announcement.id)
    toastApiMessage(result.message, "Announcement deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all })
  }

  if (!canView && !canManage) {
    return null
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
          {canView ? (
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <EyeIcon />
              View
            </DropdownMenuItem>
          ) : null}
          {canManage ? (
            <DropdownMenuItem onClick={() => onEdit(announcement)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          ) : null}
          {canManage ? (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {canView ? (
        <RecordViewDialog
          open={viewOpen}
          onOpenChange={setViewOpen}
          title={announcement.title}
          description="Announcement details"
          fields={getAnnouncementViewFields(announcement)}
        />
      ) : null}

      {canManage ? (
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
      ) : null}
    </>
  )
}
