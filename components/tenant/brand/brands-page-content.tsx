"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { BrandFormDialog } from "@/components/tenant/brand/brand-form-dialog"
import { BrandMetricCards } from "@/components/tenant/brand/brand-metric-cards"
import { BrandsDataTable } from "@/components/tenant/brand/brands-data-table"
import { TenantCan } from "@/components/tenant/can"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { TenantPermissions } from "@/lib/tenant/auth/permissions"
import type { Brand } from "@/types/tenant/brand"

export function BrandsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingBrand(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((brand: Brand) => {
    setEditingBrand(brand)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Brands"
        description="Manage product brands, logos, and catalog visibility."
      >
        <TenantCan permission={TenantPermissions.catalog.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create brand
          </Button>
        </TenantCan>
      </PageHeader>

      <BrandMetricCards />

      <BrandsDataTable onEdit={openEdit} />

      <BrandFormDialog
        brand={editingBrand}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
