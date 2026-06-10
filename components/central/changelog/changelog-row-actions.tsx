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
import { toastApiMessage } from "@/lib/central/api/toast"
import { Permissions } from "@/lib/central/auth/permissions"
import { getChangelogViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { changelogService } from "@/services/central/changelog.service"
import type { PlatformChangelog } from "@/types/central/changelog"

interface ChangelogRowActionsProps {
  entry: PlatformChangelog
  onEdit: (entry: PlatformChangelog) => void
}

export function ChangelogRowActions({ entry, onEdit }: ChangelogRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.platform.view)
  const canManage = can(Permissions.platform.manage)

  async function handleDelete() {
    const result = await changelogService.delete(entry.id)
    toastApiMessage(result.message, "Changelog entry deleted.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.changelog.all })
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
            <DropdownMenuItem onClick={() => onEdit(entry)}>
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
          title={`${entry.version} — ${entry.title}`}
          description="Changelog entry"
          fields={getChangelogViewFields(entry)}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete changelog entry?"
          description={
            <>
              Permanently delete{" "}
              <span className="font-medium text-foreground">{entry.title}</span>{" "}
              from version{" "}
              <span className="font-medium text-foreground">{entry.version}</span>.
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
