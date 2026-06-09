"use client"

import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { ApiError } from "@/lib/central/api/errors"
import type { Subscription } from "@/types/central/subscription"

interface SubscriptionCancelDialogProps {
  subscription: Subscription
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason?: string) => Promise<void>
}

export function SubscriptionCancelDialog({
  subscription,
  open,
  onOpenChange,
  onConfirm,
}: SubscriptionCancelDialogProps) {
  const [reason, setReason] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setReason("")
      setErrorMessage(null)
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await onConfirm(reason.trim() || undefined)
      onOpenChange(false)
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Subscription could not be cancelled. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const tenantName = subscription.tenant?.name ?? "this tenant"

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Cancel subscription</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Cancel the subscription for {tenantName} on the{" "}
              {subscription.plan?.name ?? "current"} plan.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="cancel-reason">
                Cancellation reason (optional)
              </FieldLabel>
              <Textarea
                id="cancel-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Why is this subscription being cancelled?"
              />
            </Field>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </div>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose render={<Button type="button" variant="outline" />}>
              Keep subscription
            </ResponsiveDialogClose>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
              Cancel subscription
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
