"use client"

import { useQueryClient } from "@tanstack/react-query"
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react"
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
import { getHealthCheckViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { healthCheckService } from "@/services/central/health-check.service"
import {
  healthCheckTypeLabels,
  type HealthCheck,
  type HealthCheckType,
} from "@/types/central/health-check"

interface HealthCheckRowActionsProps {
  healthCheck: HealthCheck
}

export function HealthCheckRowActions({ healthCheck }: HealthCheckRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.monitoring.view)
  const canManage = can(Permissions.monitoring.manage)
  const checkLabel =
    healthCheckTypeLabels[healthCheck.check_type as HealthCheckType] ??
    healthCheck.check_type

  async function handleDelete() {
    const result = await healthCheckService.delete(healthCheck.id)
    toastApiMessage(result.message, "Health check deleted.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.healthChecks.all })
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
          title={checkLabel}
          description={healthCheck.tenant?.name ?? "Health check details"}
          fields={getHealthCheckViewFields(healthCheck)}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete health check?"
          description={
            <>
              Remove the{" "}
              <span className="font-medium text-foreground">{checkLabel}</span>{" "}
              record for{" "}
              <span className="font-medium text-foreground">
                {healthCheck.tenant?.name ?? "this tenant"}
              </span>
              .
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
