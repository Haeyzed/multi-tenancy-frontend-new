"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  EyeIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { RecordViewDialog } from "@/components/central/record-view-dialog"
import { SubscriptionInvoicesDialog } from "@/components/central/subscription/subscription-invoices-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePermissions } from "@/hooks/use-permissions"
import { Permissions } from "@/lib/central/auth/permissions"
import { getSubscriptionViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { subscriptionService } from "@/services/central/subscription.service"
import type { Subscription } from "@/types/central/subscription"

interface SubscriptionRowActionsProps {
  subscription: Subscription
}

export function SubscriptionRowActions({
  subscription,
}: SubscriptionRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [invoicesOpen, setInvoicesOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.billing.view)
  const canManage = can(Permissions.billing.manage)

  const tenantName = subscription.tenant?.name ?? "this tenant"
  const planName = subscription.plan?.name ?? "unknown plan"

  async function handleDelete() {
    await subscriptionService.delete(subscription.id)
    await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all })
  }

  if (!canView && !canManage) {
    return null
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
          {canView ? (
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <EyeIcon />
              View
            </DropdownMenuItem>
          ) : null}
          {canView ? (
            <DropdownMenuItem onClick={() => setInvoicesOpen(true)}>
              <FileTextIcon />
              View invoices
            </DropdownMenuItem>
          ) : null}
          {canManage ? <DropdownMenuItem>Cancel</DropdownMenuItem> : null}
          {canManage ? (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {canView ? (
        <RecordViewDialog
          open={viewOpen}
          onOpenChange={setViewOpen}
          title={tenantName}
          description={`Subscription on ${planName}`}
          fields={getSubscriptionViewFields(subscription)}
        />
      ) : null}

      {canView ? (
        <SubscriptionInvoicesDialog
          subscription={subscription}
          open={invoicesOpen}
          onOpenChange={setInvoicesOpen}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete subscription?"
          description={
            <>
              This will permanently delete the subscription for{" "}
              <span className="font-medium text-foreground">{tenantName}</span> on
              the{" "}
              <span className="font-medium text-foreground">{planName}</span> plan.
              This action cannot be undone.
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
