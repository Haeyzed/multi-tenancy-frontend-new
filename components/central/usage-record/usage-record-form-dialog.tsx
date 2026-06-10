"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
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
import { usageMetricOptions } from "@/lib/data-table/usage-filter-options"
import { queryKeys } from "@/lib/central/query/keys"
import { subscriptionService } from "@/services/central/subscription.service"
import { tenantService } from "@/services/central/tenant.service"
import { usageRecordService } from "@/services/central/usage-record.service"
import {
  UsageMetrics,
  type UsageRecord,
} from "@/types/central/usage-record"
import { useTenant } from "@/providers/central/tenant-provider"

interface UsageRecordFormDialogProps {
  record: UsageRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UsageRecordFormState {
  tenantId: string
  subscriptionId: string
  metric: string
  quantity: string
  recordedAt: string
}

function defaultRecordedAt() {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm")
}

function recordToFormState(
  record: UsageRecord | null,
  defaultTenantId: string | null,
): UsageRecordFormState {
  return {
    tenantId: record?.tenant_id ?? defaultTenantId ?? "",
    subscriptionId: record?.subscription_id ?? "",
    metric: record?.metric ? String(record.metric) : UsageMetrics.ApiCalls,
    quantity: record ? String(record.quantity) : "",
    recordedAt: record?.recorded_at
      ? format(new Date(record.recorded_at), "yyyy-MM-dd'T'HH:mm")
      : defaultRecordedAt(),
  }
}

export function UsageRecordFormDialog({
  record,
  open,
  onOpenChange,
}: UsageRecordFormDialogProps) {
  const isEditing = record !== null
  const queryClient = useQueryClient()
  const { selectedTenantId } = useTenant()
  const [form, setForm] = React.useState<UsageRecordFormState>(() =>
    recordToFormState(record, selectedTenantId),
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const tenantsQuery = useQuery({
    queryKey: queryKeys.tenants.options(),
    queryFn: () => tenantService.getOptions(),
    enabled: open,
  })

  const subscriptionsQuery = useQuery({
    queryKey: queryKeys.subscriptions.list({
      page: 1,
      perPage: 100,
      search: "",
      status: "",
      tenantId: form.tenantId || selectedTenantId,
    }),
    queryFn: () =>
      subscriptionService.getPaginated({
        page: 1,
        per_page: 100,
      }),
    enabled: open && Boolean(form.tenantId || selectedTenantId),
  })

  const tenants = tenantsQuery.data ?? []
  const subscriptionItems = React.useMemo(
    () =>
      (subscriptionsQuery.data?.data ?? []).map((subscription) => ({
        label: subscription.plan?.name
          ? `${subscription.plan.name} (${subscription.id.slice(0, 8)})`
          : subscription.id.slice(0, 8),
        value: subscription.id,
      })),
    [subscriptionsQuery.data?.data],
  )

  React.useEffect(() => {
    if (open) {
      setForm(recordToFormState(record, selectedTenantId))
      setErrorMessage(null)
    }
  }, [open, record, selectedTenantId])

  const mutation = useMutation({
    mutationFn: async (state: UsageRecordFormState) => {
      const payload = {
        tenant_id: state.tenantId,
        subscription_id: state.subscriptionId || null,
        metric: state.metric,
        quantity: Number(state.quantity),
        recorded_at: new Date(state.recordedAt).toISOString(),
      }

      if (isEditing && record) {
        return usageRecordService.update(record.id, payload)
      }

      return usageRecordService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Usage record updated." : "Usage record created.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.usageRecords.all })
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
            {isEditing ? "Edit usage record" : "Record usage"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update metered usage for billing and plan limits."
              : "Log a metered usage measurement for a tenant."}
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
              <FieldLabel htmlFor="usage-tenant">Tenant</FieldLabel>
              <OptionsCombobox
                id="usage-tenant"
                items={tenants}
                value={form.tenantId}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    tenantId: value,
                    subscriptionId: "",
                  }))
                }
                placeholder="Select tenant"
                disabled={tenantLocked || isPending || isEditing}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="usage-subscription">Subscription</FieldLabel>
              <OptionsCombobox
                id="usage-subscription"
                items={subscriptionItems}
                value={form.subscriptionId}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, subscriptionId: value }))
                }
                placeholder="Optional subscription"
                disabled={isPending || !form.tenantId}
              />
              <FieldDescription>Optional link to a subscription.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="usage-metric">Metric</FieldLabel>
              <OptionsCombobox
                id="usage-metric"
                items={usageMetricOptions}
                value={form.metric}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, metric: value }))
                }
                placeholder="Select metric"
                disabled={isPending}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="usage-quantity">Quantity</FieldLabel>
              <Input
                id="usage-quantity"
                type="number"
                min="0"
                step="0.01"
                value={form.quantity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quantity: event.target.value,
                  }))
                }
                placeholder="1500"
                disabled={isPending}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="usage-recorded-at">Recorded at</FieldLabel>
              <Input
                id="usage-recorded-at"
                type="datetime-local"
                value={form.recordedAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    recordedAt: event.target.value,
                  }))
                }
                disabled={isPending}
                required
              />
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
            <Button
              type="submit"
              disabled={isPending || !form.tenantId || !form.metric || !form.quantity}
            >
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {isEditing ? "Save changes" : "Record usage"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
