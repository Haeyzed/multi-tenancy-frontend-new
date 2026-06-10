"use client"

import { useQuery } from "@tanstack/react-query"
import { KeyIcon, ShieldAlertIcon, ShieldCheckIcon, ShieldOffIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { apiKeyService } from "@/services/central/api-key.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  total: KeyIcon,
  active: ShieldCheckIcon,
  inactive: ShieldOffIcon,
  expired: ShieldAlertIcon,
}

export function ApiKeyMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.apiKeys.metrics(selectedTenantId),
    queryFn: () => apiKeyService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={KeyIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="API key KPI cards could not be loaded. Please try again."
    />
  )
}
