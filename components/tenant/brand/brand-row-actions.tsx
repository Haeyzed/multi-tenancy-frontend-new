"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  EyeIcon,
  Link2OffIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { RecordViewDialog } from "@/components/central/record-view-dialog"
import { BrandLogoImage } from "@/components/tenant/brand/brand-logo-image"
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
    { label: "Trashed", value: brand.deleted_at ? "Yes" : "No" },
    { label: "Sort order", value: String(brand.sort_order) },
    { label: "Linked products", value: String(brand.products_count ?? 0) },
    {
      label: "Logo",
      fullWidth: true,
      value: brand.logo_media?.url ? (
        <BrandLogoImage
          url={brand.logo_media.url}
          alt={brand.logo_media.file_name ?? brand.name}
          variant="view"
        />
      ) : (
        "—"
      ),
    },
  ]
}

export function BrandRowActions({ brand, onEdit }: BrandRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = useTenantPermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [restoreOpen, setRestoreOpen] = React.useState(false)
  const [unlinkOpen, setUnlinkOpen] = React.useState(false)

  const canView = can(TenantPermissions.catalog.view)
  const canManage = can(TenantPermissions.catalog.manage)
  const isTrashed = Boolean(brand.deleted_at)
  const linkedProductsCount = brand.products_count ?? 0
  const hasLinkedProducts = linkedProductsCount > 0

  async function handleDelete() {
    const result = await brandService.delete(brand.id)
    toastApiMessage(result.message, "Brand deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
  }

  async function handleRestore() {
    const result = await brandService.restore(brand.id)
    toastApiMessage(result.message, "Brand restored successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
  }

  async function handleUnlink() {
    const result = await brandService.unlink(brand.id)
    toastApiMessage(result.message, "Products unlinked from brand successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.products.all })
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
          {canManage && !isTrashed ? (
            <DropdownMenuItem onClick={() => onEdit(brand)}>
              <PencilIcon />
              Edit brand
            </DropdownMenuItem>
          ) : null}
          {canManage && !isTrashed && hasLinkedProducts ? (
            <DropdownMenuItem onClick={() => setUnlinkOpen(true)}>
              <Link2OffIcon />
              Unlink products
            </DropdownMenuItem>
          ) : null}
          {canManage && isTrashed ? (
            <DropdownMenuItem onClick={() => setRestoreOpen(true)}>
              <RotateCcwIcon />
              Restore
            </DropdownMenuItem>
          ) : null}
          {canManage && !isTrashed ? (
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

      {canManage && !isTrashed ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete brand?"
          description={
            <>
              This will move{" "}
              <span className="font-medium text-foreground">{brand.name}</span> to the
              trash.
              {hasLinkedProducts ? (
                <>
                  {" "}
                  This brand is linked to {linkedProductsCount} product
                  {linkedProductsCount === 1 ? "" : "s"}. Unlink products before
                  deleting.
                </>
              ) : null}
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}

      {canManage && isTrashed ? (
        <DeleteConfirmDialog
          open={restoreOpen}
          onOpenChange={setRestoreOpen}
          title="Restore brand?"
          description={
            <>
              This will restore{" "}
              <span className="font-medium text-foreground">{brand.name}</span>.
            </>
          }
          onConfirm={handleRestore}
          confirmLabel="Restore"
        />
      ) : null}

      {canManage && !isTrashed && hasLinkedProducts ? (
        <DeleteConfirmDialog
          open={unlinkOpen}
          onOpenChange={setUnlinkOpen}
          title="Unlink products from brand?"
          description={
            <>
              This will remove the brand assignment from{" "}
              <span className="font-medium text-foreground">{linkedProductsCount}</span>{" "}
              linked product{linkedProductsCount === 1 ? "" : "s"}. The products will
              not be deleted.
            </>
          }
          onConfirm={handleUnlink}
          confirmLabel="Unlink products"
        />
      ) : null}
    </>
  )
}
