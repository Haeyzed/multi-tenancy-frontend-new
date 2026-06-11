"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

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
import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  databaseFromSlug,
  domainFromSlug,
  tenantDomainPlaceholder,
  formStateToPayload,
  slugifyTenantName,
  tenantToFormState,
  type TenantFormState,
} from "@/lib/central/tenant/tenant-form-utils"
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { queryKeys } from "@/lib/central/query/keys"
import { planService } from "@/services/central/plan.service"
import { tenantService } from "@/services/central/tenant.service"
import { TenantStatuses, type Tenant } from "@/types/central/tenant"

interface TenantFormDialogProps {
  tenant: Tenant | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const tenantStatusOptions = [
  { value: TenantStatuses.Pending, label: "Pending" },
  { value: TenantStatuses.Active, label: "Active" },
  { value: TenantStatuses.Suspended, label: "Suspended" },
  { value: TenantStatuses.Cancelled, label: "Cancelled" },
]

const billingCycleOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

export function TenantFormDialog({
  tenant,
  open,
  onOpenChange,
}: TenantFormDialogProps) {
  const isEditing = tenant !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<TenantFormState>(() =>
    tenantToFormState(tenant),
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [slugTouched, setSlugTouched] = React.useState(false)
  const [databaseTouched, setDatabaseTouched] = React.useState(false)
  const [domainTouched, setDomainTouched] = React.useState(false)

  const plansQuery = useQuery({
    queryKey: queryKeys.plans.options(),
    queryFn: () => planService.getOptions(),
    enabled: open,
  })

  const plans = plansQuery.data ?? []
  const planOptions = React.useMemo(
    () => [{ value: "none", label: "No plan" }, ...plans],
    [plans],
  )

  React.useEffect(() => {
    if (open) {
      setForm(tenantToFormState(tenant))
      setErrorMessage(null)
      setSlugTouched(Boolean(tenant))
      setDatabaseTouched(Boolean(tenant))
      setDomainTouched(Boolean(tenant))
    }
  }, [open, tenant])

  const mutation = useMutation({
    mutationFn: async (state: TenantFormState) => {
      const payload = formStateToPayload(state)

      if (isEditing && tenant) {
        return tenantService.update(tenant.id, payload)
      }

      return tenantService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Tenant updated successfully." : "Tenant created successfully.",
      )
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.tenants.options() }),
      ])
      onOpenChange(false)
    },
  })

  function updateField<K extends keyof TenantFormState>(
    key: K,
    value: TenantFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleNameChange(name: string) {
    setForm((current) => {
      const slug =
        !isEditing && !slugTouched ? slugifyTenantName(name) : current.slug

      return {
        ...current,
        name,
        slug,
        database:
          !isEditing && !databaseTouched ? databaseFromSlug(slug) : current.database,
        domain: !isEditing && !domainTouched ? domainFromSlug(slug) : current.domain,
      }
    })
  }

  function handleSlugChange(slug: string) {
    setSlugTouched(true)
    setForm((current) => ({
      ...current,
      slug,
      database: !databaseTouched ? databaseFromSlug(slug) : current.database,
      domain: !domainTouched ? domainFromSlug(slug) : current.domain,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await mutation.mutateAsync(form)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to save tenant. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit tenant" : "Create tenant"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update tenant organization details and lifecycle settings."
              : "Provision a new tenant on the platform."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="tenant-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="tenant-name">Name</FieldLabel>
                <Input
                  id="tenant-name"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Acme Corp"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tenant-slug">Slug</FieldLabel>
                <Input
                  id="tenant-slug"
                  value={form.slug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  placeholder="acme-corp"
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="tenant-database">Database</FieldLabel>
                <Input
                  id="tenant-database"
                  value={form.database}
                  onChange={(event) => {
                    setDatabaseTouched(true)
                    updateField("database", event.target.value)
                  }}
                  placeholder="tenant_acme_corp"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tenant-domain">Domain</FieldLabel>
                <Input
                  id="tenant-domain"
                  value={form.domain}
                  onChange={(event) => {
                    setDomainTouched(true)
                    updateField("domain", event.target.value)
                  }}
                  placeholder={tenantDomainPlaceholder("acme")}
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="tenant-status">Status</FieldLabel>
                <OptionsCombobox
                  id="tenant-status"
                  items={tenantStatusOptions}
                  value={form.status}
                  onValueChange={(value) =>
                    updateField("status", value as TenantFormState["status"])
                  }
                  placeholder="Select status"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tenant-billing-cycle">Billing cycle</FieldLabel>
                <OptionsCombobox
                  id="tenant-billing-cycle"
                  items={billingCycleOptions}
                  value={form.billingCycle}
                  onValueChange={(value) =>
                    updateField("billingCycle", value as TenantFormState["billingCycle"])
                  }
                  placeholder="Select billing cycle"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="tenant-plan">Plan</FieldLabel>
              {plansQuery.isLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <OptionsCombobox
                  id="tenant-plan"
                  items={planOptions}
                  value={form.planId || "none"}
                  onValueChange={(value) =>
                    updateField("planId", value === "none" ? "" : value)
                  }
                  placeholder="Select plan"
                />
              )}
              <FieldDescription>Optional subscription plan assignment</FieldDescription>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="tenant-owner-name">Owner name</FieldLabel>
                <Input
                  id="tenant-owner-name"
                  value={form.ownerName}
                  onChange={(event) => updateField("ownerName", event.target.value)}
                  placeholder="John Smith"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tenant-owner-email">Owner email</FieldLabel>
                <Input
                  id="tenant-owner-email"
                  type="email"
                  value={form.ownerEmail}
                  onChange={(event) => updateField("ownerEmail", event.target.value)}
                  placeholder="owner@acme.com"
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="tenant-trial-ends">Trial ends</FieldLabel>
                <Input
                  id="tenant-trial-ends"
                  type="datetime-local"
                  value={form.trialEndsAt}
                  onChange={(event) => updateField("trialEndsAt", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tenant-subscribed">Subscribed</FieldLabel>
                <Input
                  id="tenant-subscribed"
                  type="datetime-local"
                  value={form.subscribedAt}
                  onChange={(event) => updateField("subscribedAt", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tenant-expires">Expires</FieldLabel>
                <Input
                  id="tenant-expires"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(event) => updateField("expiresAt", event.target.value)}
                />
              </Field>
            </div>
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
          <Button type="submit" form="tenant-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create tenant"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
