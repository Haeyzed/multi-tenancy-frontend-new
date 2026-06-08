"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { PlanFormDialog } from "@/components/central/plan/plan-form-dialog"
import { PlanMetricCards } from "@/components/central/plan/plan-metric-cards"
import { PlansDataTable } from "@/components/central/plan/plans-data-table"
import { Can } from "@/components/central/can"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
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
    <>
      <PageHeader
        title="Plans"
        description="Manage subscription plans, pricing tiers, and enforceable features."
      >
        <Can permission={Permissions.billing.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create plan
          </Button>
        </Can>
      </PageHeader>

      <PlanMetricCards />

      <PlansDataTable onEdit={openEdit} />

      <PlanFormDialog
        plan={editingPlan}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
