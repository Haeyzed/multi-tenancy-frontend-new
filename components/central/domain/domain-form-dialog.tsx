"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantDomainPlaceholder } from "@/lib/central/tenant/tenant-form-utils"
import { domainService } from "@/services/central/domain.service"
import { tenantService } from "@/services/central/tenant.service"
import type { Domain } from "@/types/central/domain"
import { useTenant } from "@/providers/central/tenant-provider"

interface DomainFormDialogProps {
  domain: Domain | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DomainFormState {
  tenantId: string
  domain: string
  isPrimary: boolean
  isFallback: boolean
}

function domainToFormState(
  domain: Domain | null,
  defaultTenantId: string | null,
): DomainFormState {
  return {
    tenantId: domain?.tenant_id ?? defaultTenantId ?? "",
    domain: domain?.domain ?? "",
    isPrimary: domain?.is_primary ?? false,
    isFallback: domain?.is_fallback ?? false,
  }
}

export function DomainFormDialog({
  domain,
  open,
  onOpenChange,
}: DomainFormDialogProps) {
  const isEditing = domain !== null
  const queryClient = useQueryClient()
  const { selectedTenantId } = useTenant()
  const [form, setForm] = React.useState<DomainFormState>(() =>
    domainToFormState(domain, selectedTenantId),
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const tenantsQuery = useQuery({
    queryKey: queryKeys.tenants.options(),
    queryFn: () => tenantService.getOptions(),
    enabled: open,
  })

  const tenants = tenantsQuery.data ?? []

  React.useEffect(() => {
    if (open) {
      setForm(domainToFormState(domain, selectedTenantId))
      setErrorMessage(null)
    }
  }, [open, domain, selectedTenantId])

  const mutation = useMutation({
    mutationFn: async (state: DomainFormState) => {
      const payload = {
        tenant_id: state.tenantId,
        domain: state.domain.trim(),
        is_primary: state.isPrimary,
        is_fallback: state.isFallback,
      }

      if (isEditing && domain) {
        return domainService.update(domain.id, payload)
      }

      return domainService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Domain updated successfully." : "Domain created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.domains.all })
      onOpenChange(false)
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Something went wrong.",
      )
    },
  })

  const isPending = mutation.isPending
  const tenantLocked = Boolean(selectedTenantId) && !isEditing

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit domain" : "Add domain"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update hostname settings for this tenant domain."
              : "Register a custom hostname for a tenant."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate(form)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="domain-tenant">Tenant</FieldLabel>
              <OptionsCombobox
                id="domain-tenant"
                items={tenants}
                value={form.tenantId}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, tenantId: value }))
                }
                placeholder="Select tenant"
                disabled={tenantLocked || isPending}
              />
              {tenantLocked ? (
                <FieldDescription>
                  Scoped to the tenant selected in the sidebar switcher.
                </FieldDescription>
              ) : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="domain-hostname">Hostname</FieldLabel>
              <Input
                id="domain-hostname"
                value={form.domain}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    domain: event.target.value,
                  }))
                }
                placeholder={tenantDomainPlaceholder("acme")}
                disabled={isPending}
                required
              />
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="domain-primary"
                checked={form.isPrimary}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    isPrimary: checked === true,
                  }))
                }
                disabled={isPending}
              />
              <FieldLabel htmlFor="domain-primary">Primary domain</FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="domain-fallback"
                checked={form.isFallback}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    isFallback: checked === true,
                  }))
                }
                disabled={isPending}
              />
              <FieldLabel htmlFor="domain-fallback">Fallback domain</FieldLabel>
            </Field>

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </FieldGroup>

          <ResponsiveDialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !form.tenantId}>
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {isEditing ? "Save changes" : "Add domain"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
