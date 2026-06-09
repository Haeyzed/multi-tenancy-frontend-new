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
import { Textarea } from "@/components/ui/textarea"
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
import { tenantConfigService } from "@/services/central/tenant-config.service"
import { tenantService } from "@/services/central/tenant.service"
import type { TenantConfig } from "@/types/central/tenant-config"
import { useTenant } from "@/providers/central/tenant-provider"

interface TenantConfigFormDialogProps {
  config: TenantConfig | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TenantConfigFormState {
  tenantId: string
  key: string
  value: string
  encrypted: boolean
}

function configToFormState(
  config: TenantConfig | null,
  defaultTenantId: string | null,
): TenantConfigFormState {
  return {
    tenantId: config?.tenant_id ?? defaultTenantId ?? "",
    key: config?.key ?? "",
    value: config?.value ?? "",
    encrypted: config?.encrypted ?? false,
  }
}

export function TenantConfigFormDialog({
  config,
  open,
  onOpenChange,
}: TenantConfigFormDialogProps) {
  const isEditing = config !== null
  const queryClient = useQueryClient()
  const { selectedTenantId } = useTenant()
  const [form, setForm] = React.useState<TenantConfigFormState>(() =>
    configToFormState(config, selectedTenantId),
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
      setForm(configToFormState(config, selectedTenantId))
      setErrorMessage(null)
    }
  }, [open, config, selectedTenantId])

  const mutation = useMutation({
    mutationFn: async (state: TenantConfigFormState) => {
      const payload = {
        tenant_id: state.tenantId,
        key: state.key.trim(),
        value: state.value.trim() || null,
        encrypted: state.encrypted,
      }

      if (isEditing && config) {
        return tenantConfigService.update(config.id, payload)
      }

      return tenantConfigService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Config updated successfully." : "Config created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantConfigs.all })
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
            {isEditing ? "Edit config" : "Add config"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update a tenant-specific configuration entry."
              : "Create a key-value setting for a tenant."}
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
              <FieldLabel htmlFor="config-tenant">Tenant</FieldLabel>
              <OptionsCombobox
                id="config-tenant"
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
              <FieldLabel htmlFor="config-key">Key</FieldLabel>
              <Input
                id="config-key"
                value={form.key}
                onChange={(event) =>
                  setForm((current) => ({ ...current, key: event.target.value }))
                }
                placeholder="smtp.host"
                disabled={isPending || isEditing}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="config-value">Value</FieldLabel>
              <Textarea
                id="config-value"
                value={form.value}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    value: event.target.value,
                  }))
                }
                placeholder="smtp.mailgun.org"
                disabled={isPending}
                rows={3}
              />
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="config-encrypted"
                checked={form.encrypted}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    encrypted: checked === true,
                  }))
                }
                disabled={isPending}
              />
              <FieldLabel htmlFor="config-encrypted">Store encrypted</FieldLabel>
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
            <Button type="submit" disabled={isPending || !form.tenantId || !form.key}>
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {isEditing ? "Save changes" : "Add config"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
