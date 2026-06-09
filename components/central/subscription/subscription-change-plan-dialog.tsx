"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
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
import { queryKeys } from "@/lib/central/query/keys"
import { planService } from "@/services/central/plan.service"
import type { Subscription } from "@/types/central/subscription"

interface SubscriptionChangePlanDialogProps {
  subscription: Subscription
  mode: "upgrade" | "downgrade"
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (planId: string) => Promise<void>
}

export function SubscriptionChangePlanDialog({
  subscription,
  mode,
  open,
  onOpenChange,
  onConfirm,
}: SubscriptionChangePlanDialogProps) {
  const [planId, setPlanId] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const plansQuery = useQuery({
    queryKey: queryKeys.plans.options(),
    queryFn: () => planService.getOptions(),
    enabled: open,
  })

  const plans =
    plansQuery.data?.filter((plan) => plan.value !== subscription.plan_id) ?? []

  React.useEffect(() => {
    if (open) {
      setPlanId("")
      setErrorMessage(null)
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!planId) {
      setErrorMessage("Select a plan.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await onConfirm(planId)
      onOpenChange(false)
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Plan change could not be completed. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const tenantName = subscription.tenant?.name ?? "this tenant"
  const title = mode === "upgrade" ? "Upgrade plan" : "Downgrade plan"

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Change the plan for {tenantName} from{" "}
              {subscription.plan?.name ?? "the current plan"}.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="subscription-new-plan">New plan</FieldLabel>
              {plansQuery.isLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <OptionsCombobox
                  id="subscription-new-plan"
                  items={plans}
                  value={planId}
                  onValueChange={setPlanId}
                  placeholder="Select a plan"
                />
              )}
            </Field>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </div>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </ResponsiveDialogClose>
            <Button type="submit" disabled={isSubmitting || plansQuery.isLoading}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
              {title}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
