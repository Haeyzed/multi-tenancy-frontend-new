"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { RecordViewDialog } from "@/components/central/record-view-dialog"
import { SubscriptionCancelDialog } from "@/components/central/subscription/subscription-cancel-dialog"
import { SubscriptionChangePlanDialog } from "@/components/central/subscription/subscription-change-plan-dialog"
import { SubscriptionInvoicesDialog } from "@/components/central/subscription/subscription-invoices-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePermissions } from "@/hooks/use-permissions"
import { toastApiMessage } from "@/lib/central/api/toast"
import { Permissions } from "@/lib/central/auth/permissions"
import { getSubscriptionViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { subscriptionService } from "@/services/central/subscription.service"
import {
  SubscriptionStatuses,
  type Subscription,
} from "@/types/central/subscription"

interface SubscriptionRowActionsProps {
  subscription: Subscription
}

const cancellableStatuses = new Set([
  SubscriptionStatuses.Active,
  SubscriptionStatuses.Trialing,
  SubscriptionStatuses.PastDue,
  SubscriptionStatuses.Paused,
])

const renewableStatuses = new Set([
  SubscriptionStatuses.Active,
  SubscriptionStatuses.PastDue,
])

const reactivatableStatuses = new Set([
  SubscriptionStatuses.Cancelled,
  SubscriptionStatuses.Expired,
])

const changeablePlanStatuses = new Set([
  SubscriptionStatuses.Active,
  SubscriptionStatuses.Trialing,
])

export function SubscriptionRowActions({
  subscription,
}: SubscriptionRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [invoicesOpen, setInvoicesOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [cancelOpen, setCancelOpen] = React.useState(false)
  const [renewOpen, setRenewOpen] = React.useState(false)
  const [reactivateOpen, setReactivateOpen] = React.useState(false)
  const [upgradeOpen, setUpgradeOpen] = React.useState(false)
  const [downgradeOpen, setDowngradeOpen] = React.useState(false)

  const canView = can(Permissions.billing.view)
  const canManage = can(Permissions.billing.manage)

  const tenantName = subscription.tenant?.name ?? "this tenant"
  const planName = subscription.plan?.name ?? "unknown plan"

  async function invalidateBillingQueries() {
    await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all })
    await queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
    await queryClient.invalidateQueries({ queryKey: queryKeys.payments.all })
  }

  async function handleDelete() {
    const result = await subscriptionService.delete(subscription.id)
    toastApiMessage(result.message, "Subscription deleted successfully.")
    await invalidateBillingQueries()
  }

  async function handleCancel(reason?: string) {
    const result = await subscriptionService.cancel(subscription.id, reason)
    toastApiMessage(result.message, "Subscription cancelled successfully.")
    await invalidateBillingQueries()
  }

  async function handleRenew() {
    const result = await subscriptionService.renew(subscription.id)
    toastApiMessage(result.message, "Subscription renewed successfully.")
    await invalidateBillingQueries()
  }

  async function handleReactivate() {
    const result = await subscriptionService.reactivate(subscription.id)
    toastApiMessage(result.message, "Subscription reactivated successfully.")
    await invalidateBillingQueries()
  }

  async function handleUpgrade(planId: string) {
    const result = await subscriptionService.upgrade(subscription.id, planId)
    toastApiMessage(result.message, "Subscription upgraded successfully.")
    await invalidateBillingQueries()
  }

  async function handleDowngrade(planId: string) {
    const result = await subscriptionService.downgrade(subscription.id, planId)
    toastApiMessage(result.message, "Subscription downgraded successfully.")
    await invalidateBillingQueries()
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
          {canManage && cancellableStatuses.has(subscription.status) ? (
            <DropdownMenuItem onClick={() => setCancelOpen(true)}>
              <XCircleIcon />
              Cancel
            </DropdownMenuItem>
          ) : null}
          {canManage && renewableStatuses.has(subscription.status) ? (
            <DropdownMenuItem onClick={() => setRenewOpen(true)}>
              <RefreshCwIcon />
              Renew
            </DropdownMenuItem>
          ) : null}
          {canManage && reactivatableStatuses.has(subscription.status) ? (
            <DropdownMenuItem onClick={() => setReactivateOpen(true)}>
              <RotateCcwIcon />
              Reactivate
            </DropdownMenuItem>
          ) : null}
          {canManage && changeablePlanStatuses.has(subscription.status) ? (
            <DropdownMenuItem onClick={() => setUpgradeOpen(true)}>
              <ArrowUpIcon />
              Upgrade plan
            </DropdownMenuItem>
          ) : null}
          {canManage && changeablePlanStatuses.has(subscription.status) ? (
            <DropdownMenuItem onClick={() => setDowngradeOpen(true)}>
              <ArrowDownIcon />
              Downgrade plan
            </DropdownMenuItem>
          ) : null}
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
        <SubscriptionCancelDialog
          subscription={subscription}
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          onConfirm={handleCancel}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={renewOpen}
          onOpenChange={setRenewOpen}
          title="Renew subscription?"
          description={
            <>
              This will renew the billing period for{" "}
              <span className="font-medium text-foreground">{tenantName}</span>{" "}
              on the{" "}
              <span className="font-medium text-foreground">{planName}</span>{" "}
              plan and generate a new invoice.
            </>
          }
          confirmLabel="Renew"
          onConfirm={handleRenew}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={reactivateOpen}
          onOpenChange={setReactivateOpen}
          title="Reactivate subscription?"
          description={
            <>
              This will reactivate the subscription for{" "}
              <span className="font-medium text-foreground">{tenantName}</span>{" "}
              on the{" "}
              <span className="font-medium text-foreground">{planName}</span>{" "}
              plan.
            </>
          }
          confirmLabel="Reactivate"
          onConfirm={handleReactivate}
        />
      ) : null}

      {canManage ? (
        <SubscriptionChangePlanDialog
          subscription={subscription}
          mode="upgrade"
          open={upgradeOpen}
          onOpenChange={setUpgradeOpen}
          onConfirm={handleUpgrade}
        />
      ) : null}

      {canManage ? (
        <SubscriptionChangePlanDialog
          subscription={subscription}
          mode="downgrade"
          open={downgradeOpen}
          onOpenChange={setDowngradeOpen}
          onConfirm={handleDowngrade}
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
