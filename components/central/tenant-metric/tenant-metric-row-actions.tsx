"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"
import { format } from "date-fns"

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
import { getTenantMetricViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantMetricService } from "@/services/central/tenant-metric.service"
import type { TenantMetric } from "@/types/central/tenant-metric"

interface TenantMetricRowActionsProps {
  metric: TenantMetric
  onEdit: (metric: TenantMetric) => void
}

export function TenantMetricRowActions({
  metric,
  onEdit,
}: TenantMetricRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.monitoring.view)
  const canManage = can(Permissions.monitoring.manage)

  const title = metric.tenant?.name ?? "Tenant metric"
  const dateLabel = metric.metric_date
    ? format(new Date(metric.metric_date), "MMM d, yyyy")
    : "snapshot"

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: queryKeys.tenantMetrics.all })
  }

  async function handleDelete() {
    const result = await tenantMetricService.delete(metric.id)
    toastApiMessage(result.message, "Tenant metric deleted.")
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
          {canManage ? (
            <DropdownMenuItem onClick={() => onEdit(metric)}>
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
          title={`${title} — ${dateLabel}`}
          description="Daily tenant usage snapshot"
          fields={getTenantMetricViewFields(metric)}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete tenant metric?"
          description={
            <>
              Permanently delete the metric snapshot for{" "}
              <span className="font-medium text-foreground">{title}</span> on{" "}
              <span className="font-medium text-foreground">{dateLabel}</span>.
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
