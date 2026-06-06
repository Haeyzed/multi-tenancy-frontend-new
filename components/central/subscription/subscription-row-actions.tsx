"use client"

import { useQueryClient } from "@tanstack/react-query"
import { FileTextIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { SubscriptionInvoicesDialog } from "@/components/central/subscription/subscription-invoices-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [invoicesOpen, setInvoicesOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const tenantName = subscription.tenant?.name ?? "this tenant"
  const planName = subscription.plan?.name ?? "unknown plan"

  async function handleDelete() {
    await subscriptionService.delete(subscription.id)
    await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setInvoicesOpen(true)}>
            <FileTextIcon />
            View invoices
          </DropdownMenuItem>
          <DropdownMenuItem>Cancel</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SubscriptionInvoicesDialog
        subscription={subscription}
        open={invoicesOpen}
        onOpenChange={setInvoicesOpen}
      />

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
    </>
  )
}
