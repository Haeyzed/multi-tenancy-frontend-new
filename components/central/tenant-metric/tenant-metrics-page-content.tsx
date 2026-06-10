"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { TenantMetricCards } from "@/components/central/tenant-metric/tenant-metric-cards"
import { TenantMetricFormDialog } from "@/components/central/tenant-metric/tenant-metric-form-dialog"
import { TenantMetricsDataTable } from "@/components/central/tenant-metric/tenant-metrics-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { TenantMetric } from "@/types/central/tenant-metric"

export function TenantMetricsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingMetric, setEditingMetric] = React.useState<TenantMetric | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingMetric(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((metric: TenantMetric) => {
    setEditingMetric(metric)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Tenant metrics"
        description="Review daily aggregated usage, revenue, and resource consumption."
      >
        <Can permission={Permissions.monitoring.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Add metric
          </Button>
        </Can>
      </PageHeader>

      <TenantMetricCards />
      <TenantMetricsDataTable onEdit={openEdit} />

      <TenantMetricFormDialog
        metric={editingMetric}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
