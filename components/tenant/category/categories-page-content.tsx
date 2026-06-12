"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { PageHeader } from "@/components/layout/page-header"
import { CategoriesDataTable } from "@/components/tenant/category/categories-data-table"
import { CategoryFormDialog } from "@/components/tenant/category/category-form-dialog"
import { CategoryMetricCards } from "@/components/tenant/category/category-metric-cards"
import { TenantCan } from "@/components/tenant/can"
import { Button } from "@/components/ui/button"
import { TenantPermissions } from "@/lib/tenant/auth/permissions"
import type { Category } from "@/types/tenant/category"

export function CategoriesPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingCategory(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organize products with hierarchical categories."
      >
        <TenantCan permission={TenantPermissions.catalog.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create category
          </Button>
        </TenantCan>
      </PageHeader>

      <CategoryMetricCards />

      <CategoriesDataTable onEdit={openEdit} />

      <CategoryFormDialog
        category={editingCategory}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
