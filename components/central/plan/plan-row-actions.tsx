"use client"

import { useQueryClient } from "@tanstack/react-query"
import { ListChecksIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { PlanFeaturesDialog } from "@/components/central/plan/plan-features-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { queryKeys } from "@/lib/central/query/keys"
import { planService } from "@/services/central/plan.service"
import type { Plan } from "@/types/central/plan"

interface PlanRowActionsProps {
  plan: Plan
  onEdit: (plan: Plan) => void
}

export function PlanRowActions({ plan, onEdit }: PlanRowActionsProps) {
  const queryClient = useQueryClient()
  const [featuresOpen, setFeaturesOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  async function handleDelete() {
    await planService.delete(plan.id)
    await queryClient.invalidateQueries({ queryKey: queryKeys.plans.all })
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
          <DropdownMenuItem onClick={() => onEdit(plan)}>
            <PencilIcon />
            Edit plan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFeaturesOpen(true)}>
            <ListChecksIcon />
            Manage features
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PlanFeaturesDialog
        plan={plan}
        open={featuresOpen}
        onOpenChange={setFeaturesOpen}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete plan?"
        description={
          <>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{plan.name}</span> and
            remove it from the platform. This action cannot be undone.
          </>
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
