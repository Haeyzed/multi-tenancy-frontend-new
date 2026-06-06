"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import {
  formStateFromPlan,
  formStateToPayload,
  parseFeaturesJson,
  slugifyName,
  type PlanFormState,
} from "@/components/central/plan/plan-form-utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/central/api/errors"
import { queryKeys } from "@/lib/central/query/keys"
import { planService } from "@/services/central/plan.service"
import type { Plan } from "@/types/central/plan"

interface PlanFormDialogProps {
  plan: Plan | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlanFormDialog({ plan, open, onOpenChange }: PlanFormDialogProps) {
  const isEditing = plan !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<PlanFormState>(() => formStateFromPlan(plan))
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [slugTouched, setSlugTouched] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setForm(formStateFromPlan(plan))
      setErrorMessage(null)
      setSlugTouched(Boolean(plan))
    }
  }, [open, plan])

  const mutation = useMutation({
    mutationFn: async (state: PlanFormState) => {
      const payload = formStateToPayload(state)

      if (isEditing && plan) {
        return planService.update(plan.id, payload)
      }

      return planService.create(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.plans.all })
      onOpenChange(false)
    },
  })

  function updateField<K extends keyof PlanFormState>(
    key: K,
    value: PlanFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleNameChange(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug:
        !isEditing && !slugTouched
          ? slugifyName(name)
          : current.slug,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      parseFeaturesJson(form.featuresJson)
    } catch {
      setErrorMessage("Display features must be valid JSON object.")
      return
    }

    try {
      await mutation.mutateAsync(form)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to save plan. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit plan" : "Create plan"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update pricing, visibility, and marketing details for this plan."
              : "Add a new subscription plan to the platform."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="plan-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="plan-name">Name</FieldLabel>
                <Input
                  id="plan-name"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Professional"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-slug">Slug</FieldLabel>
                <Input
                  id="plan-slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true)
                    updateField("slug", event.target.value)
                  }}
                  placeholder="professional"
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="plan-description">Description</FieldLabel>
              <Textarea
                id="plan-description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Best for growing businesses"
                rows={3}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="plan-tier">Tier</FieldLabel>
                <Input
                  id="plan-tier"
                  type="number"
                  min={1}
                  value={form.tier}
                  onChange={(event) => updateField("tier", event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-trial-days">Trial days</FieldLabel>
                <Input
                  id="plan-trial-days"
                  type="number"
                  min={0}
                  value={form.trialDays}
                  onChange={(event) => updateField("trialDays", event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-sort-order">Sort order</FieldLabel>
                <Input
                  id="plan-sort-order"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(event) => updateField("sortOrder", event.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="plan-currency">Currency</FieldLabel>
                <Input
                  id="plan-currency"
                  value={form.currency}
                  onChange={(event) =>
                    updateField("currency", event.target.value.toUpperCase())
                  }
                  maxLength={3}
                  placeholder="NGN"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-price-monthly">Monthly price</FieldLabel>
                <Input
                  id="plan-price-monthly"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.priceMonthly}
                  onChange={(event) =>
                    updateField("priceMonthly", event.target.value)
                  }
                  required
                />
                <FieldDescription>Major currency units (e.g. 25000.00)</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="plan-price-yearly">Yearly price</FieldLabel>
                <Input
                  id="plan-price-yearly"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.priceYearly}
                  onChange={(event) =>
                    updateField("priceYearly", event.target.value)
                  }
                  required
                />
                <FieldDescription>Major currency units (e.g. 250000.00)</FieldDescription>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field orientation="horizontal">
                <Switch
                  id="plan-is-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="plan-is-active">Active</FieldLabel>
                  <FieldDescription>
                    Available for new subscriptions
                  </FieldDescription>
                </div>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  id="plan-is-public"
                  checked={form.isPublic}
                  onCheckedChange={(checked) => updateField("isPublic", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="plan-is-public">Public</FieldLabel>
                  <FieldDescription>
                    Visible on public pricing pages
                  </FieldDescription>
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="plan-features">Display features (JSON)</FieldLabel>
              <Textarea
                id="plan-features"
                value={form.featuresJson}
                onChange={(event) => updateField("featuresJson", event.target.value)}
                rows={6}
                className="font-mono text-xs"
                required
              />
              <FieldDescription>
                Marketing copy sent as the API `features` field, e.g.{" "}
                {`{"highlights":["Up to 100 products","API access"]}`}
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="plan-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create plan"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
