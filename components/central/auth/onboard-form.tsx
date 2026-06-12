"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { ApiError } from "@/lib/central/api/errors"
import {
  formatMinorAmount,
  formatPlanPrice,
  getOnboardCallbackUrl,
  getOnboardCancelUrl,
} from "@/lib/central/onboard/utils"
import {
  databaseFromSlug,
  domainFromSlug,
  slugifyTenantName,
  tenantDomainPlaceholder,
} from "@/lib/central/tenant/tenant-form-utils"
import { cn } from "@/lib/utils"
import { onboardService } from "@/services/central/onboard.service"
import type { BillingCycle, PaymentProvider, PublicPlan } from "@/types/central/onboard"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

interface OnboardFormState {
  name: string
  slug: string
  domain: string
  ownerFirstName: string
  ownerLastName: string
  ownerEmail: string
  ownerPassword: string
  ownerPasswordConfirmation: string
  planId: string
  billingCycle: BillingCycle
  paymentProvider: PaymentProvider
  notes: string
}

const billingCycleOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

const paymentProviderOptions = [
  { value: "paystack", label: "Paystack" },
  { value: "stripe", label: "Stripe" },
]

function getPlanHighlights(plan: PublicPlan): string[] {
  const features = plan.display_features

  if (features && Array.isArray(features.highlights)) {
    return features.highlights.filter((item): item is string => typeof item === "string")
  }

  return []
}

export function OnboardForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [form, setForm] = React.useState<OnboardFormState>({
    name: "",
    slug: "",
    domain: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerPasswordConfirmation: "",
    planId: "",
    billingCycle: "monthly",
    paymentProvider: "paystack",
    notes: "",
  })
  const [slugTouched, setSlugTouched] = React.useState(false)
  const [domainTouched, setDomainTouched] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const plansQuery = useQuery({
    queryKey: ["onboard", "public-plans"],
    queryFn: () => onboardService.getPublicPlans(),
  })

  const paymentConfigQuery = useQuery({
    queryKey: ["onboard", "payment-config"],
    queryFn: () => onboardService.getPaymentConfig(),
  })

  const plans = plansQuery.data ?? []
  const selectedPlan = plans.find((plan) => plan.id === form.planId) ?? null
  const trialSetupAmount = paymentConfigQuery.data?.trial_setup_amount ?? 10_000

  React.useEffect(() => {
    if (!form.planId && plans.length > 0) {
      setForm((current) => ({ ...current, planId: plans[0].id }))
    }
  }, [form.planId, plans])

  function updateField<K extends keyof OnboardFormState>(
    key: K,
    value: OnboardFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleNameChange(name: string) {
    setForm((current) => {
      const slug = !slugTouched ? slugifyTenantName(name) : current.slug

      return {
        ...current,
        name,
        slug,
        domain: !domainTouched ? domainFromSlug(slug) : current.domain,
      }
    })
  }

  function handleSlugChange(slug: string) {
    setSlugTouched(true)
    setForm((current) => ({
      ...current,
      slug,
      domain: !domainTouched ? domainFromSlug(slug) : current.domain,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    if (!form.planId) {
      setErrorMessage("Select a plan to continue.")
      return
    }

    if (form.ownerPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.")
      return
    }

    if (form.ownerPassword !== form.ownerPasswordConfirmation) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, message } = await onboardService.onboard({
        name: form.name,
        slug: form.slug,
        database: databaseFromSlug(form.slug),
        domain: form.domain,
        plan_id: form.planId,
        billing_cycle: form.billingCycle,
        owner_email: form.ownerEmail,
        owner_first_name: form.ownerFirstName.trim(),
        owner_last_name: form.ownerLastName.trim(),
        owner_password: form.ownerPassword,
        payment_provider: form.paymentProvider,
        notes: form.notes.trim() || undefined,
        success_url: getOnboardCallbackUrl(
          paymentConfigQuery.data?.checkout.callback_url,
        ),
        cancel_url: getOnboardCancelUrl(),
      })

      if (data.checkout_url) {
        window.location.assign(data.checkout_url)
        return
      }

      setErrorMessage(message ?? "Self-onboarding completed successfully.")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to complete onboarding. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Start your store</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Create your organization, choose a plan, and complete checkout to
            launch your workspace.
          </p>
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <Field>
          <FieldLabel htmlFor="onboarding-org-name">Organization name</FieldLabel>
          <Input
            id="onboarding-org-name"
            value={form.name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Acme Corp"
            required
            className="bg-background"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="onboarding-slug">Slug</FieldLabel>
            <Input
              id="onboarding-slug"
              value={form.slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="acme-corp"
              required
              className="bg-background"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="onboarding-domain">Tenant domain</FieldLabel>
            <Input
              id="onboarding-domain"
              value={form.domain}
              onChange={(event) => {
                setDomainTouched(true)
                updateField("domain", event.target.value)
              }}
              placeholder={tenantDomainPlaceholder("acme")}
              required
              className="bg-background"
            />
            <FieldDescription>
              Hostname for this store&apos;s API (not localhost:3000). Must resolve in
              Herd, e.g. {tenantDomainPlaceholder("your-store")}.
            </FieldDescription>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="onboarding-owner-first-name">First name</FieldLabel>
            <Input
              id="onboarding-owner-first-name"
              value={form.ownerFirstName}
              onChange={(event) =>
                updateField("ownerFirstName", event.target.value)
              }
              placeholder="Jane"
              required
              className="bg-background"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="onboarding-owner-last-name">Last name</FieldLabel>
            <Input
              id="onboarding-owner-last-name"
              value={form.ownerLastName}
              onChange={(event) =>
                updateField("ownerLastName", event.target.value)
              }
              placeholder="Doe"
              required
              className="bg-background"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="onboarding-owner-email">Work email</FieldLabel>
          <Input
            id="onboarding-owner-email"
            type="email"
            value={form.ownerEmail}
            onChange={(event) => updateField("ownerEmail", event.target.value)}
            placeholder="owner@acme.com"
            required
            className="bg-background"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="onboarding-owner-password">Password</FieldLabel>
            <Input
              id="onboarding-owner-password"
              type="password"
              value={form.ownerPassword}
              onChange={(event) =>
                updateField("ownerPassword", event.target.value)
              }
              autoComplete="new-password"
              minLength={8}
              required
              className="bg-background"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="onboarding-owner-password-confirmation">
              Confirm password
            </FieldLabel>
            <Input
              id="onboarding-owner-password-confirmation"
              type="password"
              value={form.ownerPasswordConfirmation}
              onChange={(event) =>
                updateField("ownerPasswordConfirmation", event.target.value)
              }
              autoComplete="new-password"
              minLength={8}
              required
              className="bg-background"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="onboarding-notes">Notes</FieldLabel>
          <Textarea
            id="onboarding-notes"
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Optional context for billing records, e.g. store location or launch details"
            rows={3}
            className="bg-background resize-none"
          />
          <FieldDescription>
            Saved on the invoice (when applicable) and onboarding history. System
            steps such as card verification are appended automatically.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Plan</FieldLabel>
          <FieldDescription>
            Public plans available for self-service onboarding.
          </FieldDescription>
          {plansQuery.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-36 w-full rounded-lg" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No public plans are available right now.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {plans.map((plan) => {
                const selected = form.planId === plan.id
                const price =
                  form.billingCycle === "monthly"
                    ? plan.price_monthly
                    : plan.price_yearly
                const highlights = getPlanHighlights(plan)

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => updateField("planId", plan.id)}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-colors hover:bg-muted/40",
                      selected && "border-primary ring-2 ring-primary/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        {plan.description ? (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {plan.description}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-sm font-medium">
                        {formatPlanPrice(price, plan.currency, form.billingCycle)}
                      </p>
                    </div>
                    {plan.trial_days > 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {plan.trial_days}-day free trial
                      </p>
                    ) : null}
                    {highlights.length > 0 ? (
                      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                        {highlights.slice(0, 3).map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </button>
                )
              })}
            </div>
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="onboarding-billing-cycle">Billing cycle</FieldLabel>
            <OptionsCombobox
              id="onboarding-billing-cycle"
              items={billingCycleOptions}
              value={form.billingCycle}
              onValueChange={(value) =>
                updateField("billingCycle", value as BillingCycle)
              }
              placeholder="Select billing cycle"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="onboarding-payment-provider">
              Payment provider
            </FieldLabel>
            <OptionsCombobox
              id="onboarding-payment-provider"
              items={paymentProviderOptions}
              value={form.paymentProvider}
              onValueChange={(value) =>
                updateField("paymentProvider", value as PaymentProvider)
              }
              placeholder="Select payment provider"
            />
          </Field>
        </div>

        {selectedPlan && selectedPlan.trial_days > 0 ? (
          <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            Plans with a free trial charge a one-time card verification fee of{" "}
            <span className="font-medium text-foreground">
              {formatMinorAmount(trialSetupAmount, selectedPlan.currency)}
            </span>{" "}
            at checkout (not the full plan price of{" "}
            {formatPlanPrice(
              form.billingCycle === "monthly"
                ? selectedPlan.price_monthly
                : selectedPlan.price_yearly,
              selectedPlan.currency,
              form.billingCycle,
            )}
            ). Your card is saved for billing after the {selectedPlan.trial_days}
            -day trial.
          </p>
        ) : null}

        <Field>
          <Button type="submit" disabled={isSubmitting || plans.length === 0}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Setting up your store...
              </>
            ) : (
              "Continue to checkout"
            )}
          </Button>
          {isSubmitting ? (
            <FieldDescription>
              Creating your tenant database. This can take up to a minute on the
              first run.
            </FieldDescription>
          ) : null}
          <FieldDescription className="text-center">
            Already have a platform account?{" "}
            <Link href="/central/login" className="underline underline-offset-4">
              Central sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
