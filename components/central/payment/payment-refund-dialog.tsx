"use client"

import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { formatMoneyFromMinor } from "@/lib/central/billing/format-money"
import { ApiError } from "@/lib/central/api/errors"
import type { Payment } from "@/types/central/payment"

interface PaymentRefundDialogProps {
  payment: Payment
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (amountMinor: number) => Promise<void>
}

export function PaymentRefundDialog({
  payment,
  open,
  onOpenChange,
  onConfirm,
}: PaymentRefundDialogProps) {
  const [amount, setAmount] = React.useState(
    (payment.amount / 100).toFixed(2),
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setAmount((payment.amount / 100).toFixed(2))
      setErrorMessage(null)
    }
  }, [open, payment.amount])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const parsed = Number.parseFloat(amount)

      if (Number.isNaN(parsed) || parsed <= 0) {
        setErrorMessage("Enter a valid refund amount.")
        return
      }

      const amountMinor = Math.round(parsed * 100)

      if (amountMinor > payment.amount) {
        setErrorMessage(
          `Refund cannot exceed ${formatMoneyFromMinor(payment.amount, payment.currency)}.`,
        )
        return
      }

      await onConfirm(amountMinor)
      onOpenChange(false)
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Refund could not be processed. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Refund payment</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Refund up to{" "}
              {formatMoneyFromMinor(payment.amount, payment.currency)} for{" "}
              {payment.tenant?.name ?? "this tenant"}.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="refund-amount">Refund amount</FieldLabel>
              <Input
                id="refund-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </Field>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </div>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </ResponsiveDialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
              Process refund
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
