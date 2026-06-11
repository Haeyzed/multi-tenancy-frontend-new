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
import { getPaymentViewFields } from "@/lib/central/view/view-fields"
import type { Payment } from "@/types/central/payment"

interface PaymentViewDialogProps {
  payment: Payment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentViewDialog({
  payment,
  open,
  onOpenChange,
}: PaymentViewDialogProps) {
  const fields = getPaymentViewFields(payment)
  const hasCard =
    payment.payment_method_last4 != null || payment.payment_method_brand != null

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {payment.provider_payment_id ?? "Payment"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {payment.tenant?.name ?? "Payment details"}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {hasCard ? (
          <div className="flex justify-center py-2">
            <PaymentCardVisual
              brand={payment.payment_method_brand}
              last4={payment.payment_method_last4}
              holderName={payment.tenant?.name ?? null}
              provider={payment.payment_provider}
            />
          </div>
        ) : null}

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
