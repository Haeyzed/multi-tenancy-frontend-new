"use client"

import { useQuery } from "@tanstack/react-query"
import {
  AlertTriangleIcon,
  Building2Icon,
  ClockIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantService } from "@/services/central/tenant.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  total: Building2Icon,
  active: UsersIcon,
  pending: ClockIcon,
  suspended: AlertTriangleIcon,
  cancelled: AlertTriangleIcon,
  on_trial: SparklesIcon,
  expiring_soon: ClockIcon,
}

export function TenantMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.tenants.metrics(selectedTenantId),
    queryFn: () => tenantService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={Building2Icon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Tenant KPI cards could not be loaded. Please try again."
    />
  )
}
