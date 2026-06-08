"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { TenantFormDialog } from "@/components/central/tenant/tenant-form-dialog"
import { TenantMetricCards } from "@/components/central/tenant/tenant-metric-cards"
import { TenantsDataTable } from "@/components/central/tenant/tenants-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { Tenant } from "@/types/central/tenant"

export function TenantsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingTenant(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((tenant: Tenant) => {
    setEditingTenant(tenant)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Tenants"
        description="Manage platform tenants, subscriptions, and lifecycle status."
      >
        <Can permission={Permissions.tenants.create}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create tenant
          </Button>
        </Can>
      </PageHeader>

      <TenantMetricCards />

      <TenantsDataTable onEdit={openEdit} />

      <TenantFormDialog
        tenant={editingTenant}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
