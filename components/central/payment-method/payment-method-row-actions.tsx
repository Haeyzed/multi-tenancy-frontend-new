"use client"

import { EyeIcon, MoreHorizontalIcon } from "lucide-react"
import * as React from "react"

import { PaymentMethodViewDialog } from "@/components/central/payment-method/payment-method-view-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePermissions } from "@/hooks/use-permissions"
import { Permissions } from "@/lib/central/auth/permissions"
import type { PaymentMethod } from "@/types/central/payment-method"

interface PaymentMethodRowActionsProps {
  method: PaymentMethod
}

export function PaymentMethodRowActions({ method }: PaymentMethodRowActionsProps) {
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const canView = can(Permissions.billing.view)

  if (!canView) {
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
          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <EyeIcon />
            View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PaymentMethodViewDialog
        method={method}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
    </>
  )
}
