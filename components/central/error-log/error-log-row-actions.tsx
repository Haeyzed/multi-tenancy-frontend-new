"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  CheckCircle2Icon,
  EyeIcon,
  MoreHorizontalIcon,
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
import { getErrorLogViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { errorLogService } from "@/services/central/error-log.service"
import type { ErrorLog } from "@/types/central/error-log"

interface ErrorLogRowActionsProps {
  errorLog: ErrorLog
}

export function ErrorLogRowActions({ errorLog }: ErrorLogRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [resolveOpen, setResolveOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.monitoring.view)
  const canManage = can(Permissions.monitoring.manage)
  const canResolve = canManage && !errorLog.resolved_at

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: queryKeys.errorLogs.all })
  }

  async function handleResolve() {
    const result = await errorLogService.resolve(errorLog.id)
    toastApiMessage(result.message, "Error log resolved.")
    await invalidate()
  }

  async function handleDelete() {
    const result = await errorLogService.delete(errorLog.id)
    toastApiMessage(result.message, "Error log deleted.")
    await invalidate()
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
          {canResolve ? (
            <DropdownMenuItem onClick={() => setResolveOpen(true)}>
              <CheckCircle2Icon />
              Resolve
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
          title={errorLog.message}
          description={errorLog.tenant?.name ?? "Platform error log"}
          fields={getErrorLogViewFields(errorLog)}
        />
      ) : null}

      {canResolve ? (
        <DeleteConfirmDialog
          open={resolveOpen}
          onOpenChange={setResolveOpen}
          title="Resolve error log?"
          description="Mark this error as resolved. It will remain in the log for audit purposes."
          confirmLabel="Resolve"
          onConfirm={handleResolve}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete error log?"
          description="Permanently remove this error log entry."
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
