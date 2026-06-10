"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
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
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { queryKeys } from "@/lib/central/query/keys"
import { apiKeyService } from "@/services/central/api-key.service"
import { tenantService } from "@/services/central/tenant.service"
import type { ApiKey } from "@/types/central/api-key"
import { useTenant } from "@/providers/central/tenant-provider"

interface ApiKeyFormDialogProps {
  apiKey: ApiKey | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (apiKey: ApiKey) => void
}

interface ApiKeyFormState {
  tenantId: string
  name: string
  expiresAt: string
}

function apiKeyToFormState(
  apiKey: ApiKey | null,
  defaultTenantId: string | null,
): ApiKeyFormState {
  return {
    tenantId: apiKey?.tenant_id ?? defaultTenantId ?? "",
    name: apiKey?.name ?? "",
    expiresAt: apiKey?.expires_at?.slice(0, 10) ?? "",
  }
}

export function ApiKeyFormDialog({
  apiKey,
  open,
  onOpenChange,
  onCreated,
}: ApiKeyFormDialogProps) {
  const isEditing = apiKey !== null
  const queryClient = useQueryClient()
  const { selectedTenantId } = useTenant()
  const [form, setForm] = React.useState<ApiKeyFormState>(() =>
    apiKeyToFormState(apiKey, selectedTenantId),
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
      setForm(apiKeyToFormState(apiKey, selectedTenantId))
      setErrorMessage(null)
    }
  }, [open, apiKey, selectedTenantId])

  const mutation = useMutation({
    mutationFn: async (state: ApiKeyFormState) => {
      const payload = {
        tenant_id: state.tenantId,
        name: state.name.trim(),
        expires_at: state.expiresAt || null,
      }

      if (isEditing && apiKey) {
        return apiKeyService.update(apiKey.id, payload)
      }

      return apiKeyService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "API key updated successfully." : "API key created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })

      if (!isEditing && result.data?.plain_key) {
        onCreated?.(result.data)
      }

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
            {isEditing ? "Edit API key" : "Create API key"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update the label or expiration for this API key."
              : "Generate a new programmatic access key for a tenant."}
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
              <FieldLabel htmlFor="api-key-tenant">Tenant</FieldLabel>
              <OptionsCombobox
                id="api-key-tenant"
                items={tenants}
                value={form.tenantId}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, tenantId: value }))
                }
                placeholder="Select tenant"
                disabled={tenantLocked || isPending || isEditing}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="api-key-name">Name</FieldLabel>
              <Input
                id="api-key-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Production integration"
                disabled={isPending}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="api-key-expires">Expires</FieldLabel>
              <Input
                id="api-key-expires"
                type="date"
                value={form.expiresAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    expiresAt: event.target.value,
                  }))
                }
                disabled={isPending}
              />
              <FieldDescription>Optional expiration date.</FieldDescription>
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
            <Button type="submit" disabled={isPending || !form.tenantId || !form.name}>
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {isEditing ? "Save changes" : "Create key"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
