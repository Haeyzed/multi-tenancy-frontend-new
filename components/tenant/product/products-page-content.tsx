"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { PageHeader } from "@/components/layout/page-header"
import { ProductFormDialog } from "@/components/tenant/product/product-form-dialog"
import { ProductMetricCards } from "@/components/tenant/product/product-metric-cards"
import { ProductsDataTable } from "@/components/tenant/product/products-data-table"
import { TenantCan } from "@/components/tenant/can"
import { Button } from "@/components/ui/button"
import { TenantPermissions } from "@/lib/tenant/auth/permissions"
import type { Product } from "@/types/tenant/product"

export function ProductsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingProduct(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage catalog products, pricing, and assignments."
      >
        <TenantCan permission={TenantPermissions.catalog.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create product
          </Button>
        </TenantCan>
      </PageHeader>

      <ProductMetricCards />

      <ProductsDataTable onEdit={openEdit} />

      <ProductFormDialog
        product={editingProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
