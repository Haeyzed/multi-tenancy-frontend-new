"use client"

import { useQuery } from "@tanstack/react-query"
import { FolderIcon, KeyRoundIcon, ShieldIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { permissionService } from "@/services/central/permission.service"

const metricIcons: Record<string, LucideIcon> = {
  total: KeyRoundIcon,
  with_module: FolderIcon,
  modules: ShieldIcon,
}

export function PermissionMetricCards() {
  const metricsQuery = useQuery({
    queryKey: queryKeys.permissions.metrics(),
    queryFn: () => permissionService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={KeyRoundIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Permission KPI cards could not be loaded. Please try again."
      className="sm:grid-cols-2 xl:grid-cols-3"
      skeletonCount={3}
    />
  )
}
