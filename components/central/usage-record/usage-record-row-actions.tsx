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
import { getUsageRecordViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { usageRecordService } from "@/services/central/usage-record.service"
import {
  usageMetricLabels,
  type UsageMetric,
  type UsageRecord,
} from "@/types/central/usage-record"

interface UsageRecordRowActionsProps {
  record: UsageRecord
  onEdit: (record: UsageRecord) => void
}

export function UsageRecordRowActions({
  record,
  onEdit,
}: UsageRecordRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.billing.view)
  const canManage = can(Permissions.billing.manage)
  const metricLabel =
    usageMetricLabels[record.metric as UsageMetric] ?? String(record.metric)

  async function handleDelete() {
    const result = await usageRecordService.delete(record.id)
    toastApiMessage(result.message, "Usage record deleted.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.usageRecords.all })
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
            <DropdownMenuItem onClick={() => onEdit(record)}>
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
          title={metricLabel}
          description={record.tenant?.name ?? "Usage record details"}
          fields={getUsageRecordViewFields(record)}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete usage record?"
          description={
            <>
              Permanently delete this{" "}
              <span className="font-medium text-foreground">{metricLabel}</span>{" "}
              record for{" "}
              <span className="font-medium text-foreground">
                {record.tenant?.name ?? "this tenant"}
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
