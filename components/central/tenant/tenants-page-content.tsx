"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { PageBreadcrumb } from "@/components/central/page-breadcrumb"
import { TenantFormDialog } from "@/components/central/tenant/tenant-form-dialog"
import { TenantMetricCards } from "@/components/central/tenant/tenant-metric-cards"
import { TenantsDataTable } from "@/components/central/tenant/tenants-data-table"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Tenants" },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
            <p className="text-sm text-muted-foreground">
              Manage platform tenants, subscriptions, and lifecycle status.
            </p>
          </div>
          <Can permission={Permissions.tenants.create}>
            <Button onClick={openCreate}>
              <PlusIcon />
              Create tenant
            </Button>
          </Can>
        </div>
      </div>

      <TenantMetricCards />

      <TenantsDataTable onEdit={openEdit} />

      <TenantFormDialog
        tenant={editingTenant}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
