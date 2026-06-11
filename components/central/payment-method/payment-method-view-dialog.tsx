"use client"

import { PaymentCardVisual } from "@/components/central/payment/payment-card-visual"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { getPaymentMethodViewFields } from "@/lib/central/view/view-fields"
import type { PaymentMethod } from "@/types/central/payment-method"

interface PaymentMethodViewDialogProps {
  method: PaymentMethod
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentMethodViewDialog({
  method,
  open,
  onOpenChange,
}: PaymentMethodViewDialogProps) {
  const fields = getPaymentMethodViewFields(method)

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {method.tenant?.name ?? "Payment method"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Saved card from {method.provider}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex justify-center py-2">
          <PaymentCardVisual
            brand={method.brand}
            last4={method.last4}
            expMonth={method.exp_month}
            expYear={method.exp_year}
            holderName={
              method.billing_details?.name ?? method.tenant?.owner_name ?? null
            }
            provider={method.provider}
            isDefault={method.is_default}
          />
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className={field.fullWidth ? "sm:col-span-2" : undefined}
            >
              <dt className="text-xs font-medium text-muted-foreground">
                {field.label}
              </dt>
              <dd
                className={
                  field.mono
                    ? "mt-1 font-mono text-sm break-all whitespace-pre-wrap"
                    : "mt-1 text-sm break-words whitespace-pre-wrap"
                }
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>

        <ResponsiveDialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
