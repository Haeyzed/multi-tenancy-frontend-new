"use client"

import { useQuery } from "@tanstack/react-query"
import { KeyRoundIcon, ShieldCheckIcon, ShieldIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { roleService } from "@/services/central/role.service"

const metricIcons: Record<string, LucideIcon> = {
  total: ShieldIcon,
  with_permissions: ShieldCheckIcon,
  web_guard: KeyRoundIcon,
}

export function RoleMetricCards() {
  const metricsQuery = useQuery({
    queryKey: queryKeys.roles.metrics(),
    queryFn: () => roleService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={ShieldIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Role KPI cards could not be loaded. Please try again."
      className="sm:grid-cols-2 xl:grid-cols-3"
      skeletonCount={3}
    />
  )
}
