"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  EyeIcon,
  Link2OffIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { RecordViewDialog } from "@/components/central/record-view-dialog"
import { CategoryMediaImage } from "@/components/tenant/category/category-media-image"
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
import { categoryService } from "@/services/tenant/category.service"
import type { Category } from "@/types/tenant/category"

interface CategoryRowActionsProps {
  category: Category
  onEdit: (category: Category) => void
}

function getCategoryViewFields(category: Category) {
  return [
    { label: "Name", value: category.name },
    { label: "Slug", value: category.slug },
    { label: "Parent", value: category.parent?.name ?? "Root" },
    { label: "Description", value: category.description ?? "—" },
    { label: "Status", value: category.is_active ? "Active" : "Inactive" },
    { label: "Featured", value: category.is_featured ? "Yes" : "No" },
    { label: "In menu", value: category.show_in_menu ? "Yes" : "No" },
    { label: "Sort order", value: String(category.sort_order) },
    { label: "Depth", value: String(category.depth) },
    { label: "Path", value: category.path ?? "—" },
    { label: "Linked products", value: String(category.products_count ?? 0) },
    {
      label: "Banner",
      fullWidth: true,
      value: category.banner_media?.url ? (
        <CategoryMediaImage
          url={category.banner_media.url}
          alt={category.banner_media.file_name ?? `${category.name} banner`}
          kind="banner"
          variant="view"
        />
      ) : (
        "—"
      ),
    },
    {
      label: "Icon",
      fullWidth: true,
      value: category.icon_media?.url ? (
        <CategoryMediaImage
          url={category.icon_media.url}
          alt={category.icon_media.file_name ?? `${category.name} icon`}
          kind="icon"
          variant="view"
        />
      ) : (
        "—"
      ),
    },
  ]
}

export function CategoryRowActions({ category, onEdit }: CategoryRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = useTenantPermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [unlinkOpen, setUnlinkOpen] = React.useState(false)

  const canView = can(TenantPermissions.catalog.view)
  const canManage = can(TenantPermissions.catalog.manage)
  const linkedProductsCount = category.products_count ?? 0
  const hasLinkedProducts = linkedProductsCount > 0

  async function handleDelete() {
    const result = await categoryService.delete(category.id)
    toastApiMessage(result.message, "Category deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.categories.all })
  }

  async function handleUnlink() {
    const result = await categoryService.unlink(category.id)
    toastApiMessage(result.message, "Products unlinked from category successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.categories.all })
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
          {canManage ? (
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <PencilIcon />
              Edit category
            </DropdownMenuItem>
          ) : null}
          {canManage && hasLinkedProducts ? (
            <DropdownMenuItem onClick={() => setUnlinkOpen(true)}>
              <Link2OffIcon />
              Unlink products
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
          title={category.name}
          description={category.slug}
          fields={getCategoryViewFields(category)}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete category?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{category.name}</span>.
              {hasLinkedProducts ? (
                <>
                  {" "}
                  This category is linked to {linkedProductsCount} product
                  {linkedProductsCount === 1 ? "" : "s"}. Unlink products before
                  deleting.
                </>
              ) : (
                " This action cannot be undone."
              )}
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}

      {canManage && hasLinkedProducts ? (
        <DeleteConfirmDialog
          open={unlinkOpen}
          onOpenChange={setUnlinkOpen}
          title="Unlink products from category?"
          description={
            <>
              This will remove the category assignment from{" "}
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
