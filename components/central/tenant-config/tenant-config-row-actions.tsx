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
import { getTenantConfigViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantConfigService } from "@/services/central/tenant-config.service"
import type { TenantConfig } from "@/types/central/tenant-config"

interface TenantConfigRowActionsProps {
  config: TenantConfig
  onEdit: (config: TenantConfig) => void
}

export function TenantConfigRowActions({
  config,
  onEdit,
}: TenantConfigRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.tenants.view)
  const canUpdate = can(Permissions.tenants.update)
  const canDelete = can(Permissions.tenants.delete)

  async function handleDelete() {
    const result = await tenantConfigService.delete(config.id)
    toastApiMessage(result.message, "Config deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.tenantConfigs.all })
  }

  if (!canView && !canUpdate && !canDelete) {
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
          {canUpdate ? (
            <DropdownMenuItem onClick={() => onEdit(config)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
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
          title={config.key}
          description={config.tenant?.name ?? "Tenant configuration"}
          fields={getTenantConfigViewFields(config)}
        />
      ) : null}

      {canDelete ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete config?"
          description={
            <>
              This will remove{" "}
              <span className="font-medium text-foreground">{config.key}</span>{" "}
              from{" "}
              <span className="font-medium text-foreground">
                {config.tenant?.name ?? "this tenant"}
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
