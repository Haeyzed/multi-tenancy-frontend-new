"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { PlanFormDialog } from "@/components/central/plan/plan-form-dialog"
import { PlanMetricCards } from "@/components/central/plan/plan-metric-cards"
import { PlansDataTable } from "@/components/central/plan/plans-data-table"
import { PageBreadcrumb } from "@/components/central/page-breadcrumb"
import { Button } from "@/components/ui/button"
import type { Plan } from "@/types/central/plan"

export function PlansPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingPlan, setEditingPlan] = React.useState<Plan | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingPlan(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((plan: Plan) => {
    setEditingPlan(plan)
    setDialogOpen(true)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Plans" },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
            <p className="text-sm text-muted-foreground">
              Manage subscription plans, pricing tiers, and enforceable features.
            </p>
          </div>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create plan
          </Button>
        </div>
      </div>

      <PlanMetricCards />

      <PlansDataTable onEdit={openEdit} />

      <PlanFormDialog
        plan={editingPlan}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
