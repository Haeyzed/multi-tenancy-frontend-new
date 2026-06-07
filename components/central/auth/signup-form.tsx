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
  getSignupCallbackUrl,
  getSignupCancelUrl,
} from "@/lib/central/signup/utils"
import {
  databaseFromSlug,
  domainFromSlug,
  slugifyTenantName,
} from "@/lib/central/tenant/tenant-form-utils"
import { cn } from "@/lib/utils"
import { signupService } from "@/services/central/signup.service"
import type { BillingCycle, PaymentProvider, PublicPlan } from "@/types/central/signup"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface SignupFormState {
  name: string
  slug: string
  domain: string
  ownerName: string
  ownerEmail: string
  planId: string
  billingCycle: BillingCycle
  paymentProvider: PaymentProvider
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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [form, setForm] = React.useState<SignupFormState>({
    name: "",
    slug: "",
    domain: "",
    ownerName: "",
    ownerEmail: "",
    planId: "",
    billingCycle: "monthly",
    paymentProvider: "paystack",
  })
  const [slugTouched, setSlugTouched] = React.useState(false)
  const [domainTouched, setDomainTouched] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const plansQuery = useQuery({
    queryKey: ["signup", "public-plans"],
    queryFn: () => signupService.getPublicPlans(),
  })

  const paymentConfigQuery = useQuery({
    queryKey: ["signup", "payment-config"],
    queryFn: () => signupService.getPaymentConfig(),
  })

  const plans = plansQuery.data ?? []
  const selectedPlan = plans.find((plan) => plan.id === form.planId) ?? null
  const trialSetupAmount = paymentConfigQuery.data?.trial_setup_amount ?? 10_000

  React.useEffect(() => {
    if (!form.planId && plans.length > 0) {
      setForm((current) => ({ ...current, planId: plans[0].id }))
    }
  }, [form.planId, plans])

  function updateField<K extends keyof SignupFormState>(
    key: K,
    value: SignupFormState[K],
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

    setIsSubmitting(true)

    try {
      const { data, message } = await signupService.signup({
        name: form.name,
        slug: form.slug,
        database: databaseFromSlug(form.slug),
        domain: form.domain,
        plan_id: form.planId,
        billing_cycle: form.billingCycle,
        owner_email: form.ownerEmail,
        owner_name: form.ownerName,
        payment_provider: form.paymentProvider,
        success_url: getSignupCallbackUrl(
          paymentConfigQuery.data?.checkout.callback_url,
        ),
        cancel_url: getSignupCancelUrl(),
      })

      if (data.checkout_url) {
        window.location.assign(data.checkout_url)
        return
      }

      setErrorMessage(message ?? "Signup completed successfully.")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to complete signup. Please try again.")
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
          <h1 className="text-2xl font-bold">Start your workspace</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Create your organization, choose a plan, and complete checkout to
            get started.
          </p>
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <Field>
          <FieldLabel htmlFor="signup-org-name">Organization name</FieldLabel>
          <Input
            id="signup-org-name"
            value={form.name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Acme Corp"
            required
            className="bg-background"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="signup-slug">Slug</FieldLabel>
            <Input
              id="signup-slug"
              value={form.slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="acme-corp"
              required
              className="bg-background"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-domain">Domain</FieldLabel>
            <Input
              id="signup-domain"
              value={form.domain}
              onChange={(event) => {
                setDomainTouched(true)
                updateField("domain", event.target.value)
              }}
              placeholder="acme.example.com"
              required
              className="bg-background"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="signup-owner-name">Your name</FieldLabel>
            <Input
              id="signup-owner-name"
              value={form.ownerName}
              onChange={(event) => updateField("ownerName", event.target.value)}
              placeholder="Jane Doe"
              required
              className="bg-background"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-owner-email">Work email</FieldLabel>
            <Input
              id="signup-owner-email"
              type="email"
              value={form.ownerEmail}
              onChange={(event) => updateField("ownerEmail", event.target.value)}
              placeholder="owner@acme.com"
              required
              className="bg-background"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Plan</FieldLabel>
          <FieldDescription>
            Public plans available for self-service signup.
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
            <FieldLabel htmlFor="signup-billing-cycle">Billing cycle</FieldLabel>
            <OptionsCombobox
              id="signup-billing-cycle"
              items={billingCycleOptions}
              value={form.billingCycle}
              onValueChange={(value) =>
                updateField("billingCycle", value as BillingCycle)
              }
              placeholder="Select billing cycle"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-payment-provider">
              Payment provider
            </FieldLabel>
            <OptionsCombobox
              id="signup-payment-provider"
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
                Creating workspace...
              </>
            ) : (
              "Continue to checkout"
            )}
          </Button>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/central/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
