"use client"

import { useQueryClient } from "@tanstack/react-query"
import { EyeIcon, MoreHorizontalIcon, Undo2Icon } from "lucide-react"
import * as React from "react"

import { PaymentRefundDialog } from "@/components/central/payment/payment-refund-dialog"
import { PaymentViewDialog } from "@/components/central/payment/payment-view-dialog"
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
import { queryKeys } from "@/lib/central/query/keys"
import { paymentService } from "@/services/central/payment.service"
import { PaymentStatuses, type Payment } from "@/types/central/payment"

interface PaymentRowActionsProps {
  payment: Payment
}

export function PaymentRowActions({ payment }: PaymentRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [refundOpen, setRefundOpen] = React.useState(false)

  const canView = can(Permissions.billing.view)
  const canManage = can(Permissions.billing.manage)
  const canRefund =
    canManage && payment.status === PaymentStatuses.Succeeded

  async function handleRefund(amountMinor: number) {
    const result = await paymentService.refund(payment.id, amountMinor)
    toastApiMessage(result.message, "Payment refunded successfully.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.payments.all })
    await queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
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
          {canRefund ? (
            <DropdownMenuItem onClick={() => setRefundOpen(true)}>
              <Undo2Icon />
              Refund
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {canView ? (
        <PaymentViewDialog
          payment={payment}
          open={viewOpen}
          onOpenChange={setViewOpen}
        />
      ) : null}

      {canRefund ? (
        <PaymentRefundDialog
          payment={payment}
          open={refundOpen}
          onOpenChange={setRefundOpen}
          onConfirm={handleRefund}
        />
      ) : null}
    </>
  )
}
