"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { Button } from "@/components/ui/button"
import {
  Field,
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
import { tenantMetricService } from "@/services/central/tenant-metric.service"
import { tenantService } from "@/services/central/tenant.service"
import type { TenantMetric } from "@/types/central/tenant-metric"
import { useTenant } from "@/providers/central/tenant-provider"

interface TenantMetricFormDialogProps {
  metric: TenantMetric | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TenantMetricFormState {
  tenantId: string
  metricDate: string
  totalOrders: string
  totalRevenue: string
  totalProducts: string
  totalCustomers: string
  storageUsedMb: string
  bandwidthUsedMb: string
  apiCalls: string
}

function defaultMetricDate() {
  return format(new Date(), "yyyy-MM-dd")
}

function metricToFormState(
  metric: TenantMetric | null,
  defaultTenantId: string | null,
): TenantMetricFormState {
  return {
    tenantId: metric?.tenant_id ?? defaultTenantId ?? "",
    metricDate: metric?.metric_date
      ? format(new Date(metric.metric_date), "yyyy-MM-dd")
      : defaultMetricDate(),
    totalOrders: String(metric?.total_orders ?? 0),
    totalRevenue: String(metric?.total_revenue ?? 0),
    totalProducts: String(metric?.total_products ?? 0),
    totalCustomers: String(metric?.total_customers ?? 0),
    storageUsedMb: String(metric?.storage_used_mb ?? 0),
    bandwidthUsedMb: String(metric?.bandwidth_used_mb ?? 0),
    apiCalls: String(metric?.api_calls ?? 0),
  }
}

export function TenantMetricFormDialog({
  metric,
  open,
  onOpenChange,
}: TenantMetricFormDialogProps) {
  const isEditing = metric !== null
  const queryClient = useQueryClient()
  const { selectedTenantId } = useTenant()
  const [form, setForm] = React.useState<TenantMetricFormState>(() =>
    metricToFormState(metric, selectedTenantId),
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
      setForm(metricToFormState(metric, selectedTenantId))
      setErrorMessage(null)
    }
  }, [open, metric, selectedTenantId])

  const mutation = useMutation({
    mutationFn: async (state: TenantMetricFormState) => {
      const payload = {
        tenant_id: state.tenantId,
        metric_date: state.metricDate,
        total_orders: Number(state.totalOrders),
        total_revenue: Number(state.totalRevenue),
        total_products: Number(state.totalProducts),
        total_customers: Number(state.totalCustomers),
        storage_used_mb: Number(state.storageUsedMb),
        bandwidth_used_mb: Number(state.bandwidthUsedMb),
        api_calls: Number(state.apiCalls),
      }

      if (isEditing && metric) {
        return tenantMetricService.update(metric.id, payload)
      }

      return tenantMetricService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Tenant metric updated." : "Tenant metric created.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantMetrics.all })
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
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit tenant metric" : "Add tenant metric"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update a daily usage and revenue snapshot."
              : "Record aggregated tenant usage for a specific date."}
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
              <FieldLabel htmlFor="metric-tenant">Tenant</FieldLabel>
              <OptionsCombobox
                id="metric-tenant"
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
              <FieldLabel htmlFor="metric-date">Metric date</FieldLabel>
              <Input
                id="metric-date"
                type="date"
                value={form.metricDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    metricDate: event.target.value,
                  }))
                }
                disabled={isPending}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="metric-orders">Orders</FieldLabel>
                <Input
                  id="metric-orders"
                  type="number"
                  min="0"
                  value={form.totalOrders}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      totalOrders: event.target.value,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="metric-revenue">Revenue</FieldLabel>
                <Input
                  id="metric-revenue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.totalRevenue}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      totalRevenue: event.target.value,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="metric-products">Products</FieldLabel>
                <Input
                  id="metric-products"
                  type="number"
                  min="0"
                  value={form.totalProducts}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      totalProducts: event.target.value,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="metric-customers">Customers</FieldLabel>
                <Input
                  id="metric-customers"
                  type="number"
                  min="0"
                  value={form.totalCustomers}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      totalCustomers: event.target.value,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="metric-storage">Storage (MB)</FieldLabel>
                <Input
                  id="metric-storage"
                  type="number"
                  min="0"
                  value={form.storageUsedMb}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      storageUsedMb: event.target.value,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="metric-bandwidth">Bandwidth (MB)</FieldLabel>
                <Input
                  id="metric-bandwidth"
                  type="number"
                  min="0"
                  value={form.bandwidthUsedMb}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      bandwidthUsedMb: event.target.value,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="metric-api-calls">API calls</FieldLabel>
                <Input
                  id="metric-api-calls"
                  type="number"
                  min="0"
                  value={form.apiCalls}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      apiCalls: event.target.value,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>
            </div>

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
              {isEditing ? "Save changes" : "Add metric"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
