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
import { useTenantPermissions } from "@/hooks/use-tenant-permissions"
import { toastApiMessage } from "@/lib/central/api/toast"
import { TenantPermissions } from "@/lib/tenant/auth/permissions"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { brandService } from "@/services/tenant/brand.service"
import type { Brand } from "@/types/tenant/brand"

interface BrandRowActionsProps {
  brand: Brand
  onEdit: (brand: Brand) => void
}

function getBrandViewFields(brand: Brand) {
  return [
    { label: "Name", value: brand.name },
    { label: "Slug", value: brand.slug },
    { label: "Description", value: brand.description ?? "—" },
    { label: "Website", value: brand.website_url ?? "—" },
    { label: "Status", value: brand.is_active ? "Active" : "Inactive" },
    { label: "Sort order", value: String(brand.sort_order) },
    {
      label: "Logo",
      value: brand.logo_media?.url ? brand.logo_media.file_name : "—",
    },
  ]
}

export function BrandRowActions({ brand, onEdit }: BrandRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = useTenantPermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(TenantPermissions.catalog.view)
  const canManage = can(TenantPermissions.catalog.manage)

  async function handleDelete() {
    const result = await brandService.delete(brand.id)
    toastApiMessage(result.message, "Brand deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
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
            <DropdownMenuItem onClick={() => onEdit(brand)}>
              <PencilIcon />
              Edit brand
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
          title={brand.name}
          description={brand.slug}
          fields={getBrandViewFields(brand)}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete brand?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{brand.name}</span>.
              This action cannot be undone.
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
