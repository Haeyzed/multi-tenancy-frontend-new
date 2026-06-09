"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { TenantConfigFormDialog } from "@/components/central/tenant-config/tenant-config-form-dialog"
import { TenantConfigsDataTable } from "@/components/central/tenant-config/tenant-configs-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { TenantConfig } from "@/types/central/tenant-config"

export function TenantConfigsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingConfig, setEditingConfig] = React.useState<TenantConfig | null>(
    null,
  )

  const openCreate = React.useCallback(() => {
    setEditingConfig(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((config: TenantConfig) => {
    setEditingConfig(config)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Tenant configs"
        description="Manage per-tenant key-value settings and encrypted secrets."
      >
        <Can permission={Permissions.tenants.create}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Add config
          </Button>
        </Can>
      </PageHeader>

      <TenantConfigsDataTable onEdit={openEdit} />

      <TenantConfigFormDialog
        config={editingConfig}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
