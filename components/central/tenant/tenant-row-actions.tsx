"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  EyeIcon,
  GlobeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SettingsIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { TenantFeaturesDialog } from "@/components/central/tenant/tenant-features-dialog"
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
import { getTenantViewFields } from "@/lib/central/view/view-fields"
import { toastApiMessage } from "@/lib/central/api/toast"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantService } from "@/services/central/tenant.service"
import type { Tenant } from "@/types/central/tenant"
import { useTenant } from "@/providers/central/tenant-provider"

interface TenantRowActionsProps {
  tenant: Tenant
  onEdit: (tenant: Tenant) => void
}

export function TenantRowActions({ tenant, onEdit }: TenantRowActionsProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { selectTenant } = useTenant()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [featuresOpen, setFeaturesOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.tenants.view)
  const canUpdate = can(Permissions.tenants.update)
  const canDelete = can(Permissions.tenants.delete)

  async function handleDelete() {
    const result = await tenantService.delete(tenant.id)
    toastApiMessage(result.message, "Tenant deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all })
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
            <DropdownMenuItem onClick={() => onEdit(tenant)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          ) : null}
          {canView ? (
            <DropdownMenuItem onClick={() => setFeaturesOpen(true)}>
              <SparklesIcon />
              View features
            </DropdownMenuItem>
          ) : null}
          {canView ? (
            <DropdownMenuItem
              onClick={() => {
                selectTenant(tenant.id)
                router.push("/central/domains")
              }}
            >
              <GlobeIcon />
              Manage domains
            </DropdownMenuItem>
          ) : null}
          {canView ? (
            <DropdownMenuItem
              onClick={() => {
                selectTenant(tenant.id)
                router.push("/central/tenant-configs")
              }}
            >
              <SettingsIcon />
              Manage configs
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
          title={tenant.name}
          description="Tenant details"
          fields={getTenantViewFields(tenant)}
        />
      ) : null}

      {canView ? (
        <TenantFeaturesDialog
          tenant={tenant}
          open={featuresOpen}
          onOpenChange={setFeaturesOpen}
        />
      ) : null}

      {canDelete ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete tenant?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{tenant.name}</span> and
              all associated data. This action cannot be undone.
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
