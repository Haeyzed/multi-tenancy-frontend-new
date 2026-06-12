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
import { productService } from "@/services/tenant/product.service"
import type { Product } from "@/types/tenant/product"

interface ProductRowActionsProps {
  product: Product
  onEdit: (product: Product) => void
}

function formatPrice(value: string | null | undefined) {
  if (!value) {
    return "—"
  }

  const amount = Number.parseFloat(value)

  if (Number.isNaN(amount)) {
    return value
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function getProductViewFields(product: Product) {
  return [
    { label: "Name", value: product.name },
    { label: "Slug", value: product.slug },
    { label: "SKU", value: product.sku },
    { label: "Brand", value: product.brand?.name ?? "—" },
    { label: "Category", value: product.category?.name ?? "—" },
    { label: "Type", value: product.type },
    { label: "Status", value: product.status },
    { label: "Visibility", value: product.visibility },
    { label: "Price", value: formatPrice(product.price) },
    { label: "Compare price", value: formatPrice(product.compare_price) },
    { label: "Cost price", value: formatPrice(product.cost_price) },
    { label: "Featured", value: product.is_featured ? "Yes" : "No" },
    { label: "Requires shipping", value: product.requires_shipping ? "Yes" : "No" },
    { label: "Allow backorders", value: product.allow_backorders ? "Yes" : "No" },
    { label: "Low stock threshold", value: String(product.low_stock_threshold) },
    { label: "Short description", value: product.short_description ?? "—" },
    { label: "Description", value: product.description ?? "—" },
  ]
}

export function ProductRowActions({ product, onEdit }: ProductRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = useTenantPermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(TenantPermissions.catalog.view)
  const canManage = can(TenantPermissions.catalog.manage)

  async function handleDelete() {
    const result = await productService.delete(product.id)
    toastApiMessage(result.message, "Product deleted successfully.")
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
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <PencilIcon />
              Edit product
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
          title={product.name}
          description={product.sku}
          fields={getProductViewFields(product)}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete product?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{product.name}</span>.
              This action cannot be undone.
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
