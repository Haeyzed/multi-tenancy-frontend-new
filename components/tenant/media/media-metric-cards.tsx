"use client"

import { useQuery } from "@tanstack/react-query"
import { FolderIcon, HardDriveIcon, ImageIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { mediaService } from "@/services/tenant/media.service"

const metricIcons: Record<string, LucideIcon> = {
  total: HardDriveIcon,
  images: ImageIcon,
  total_size_mb: FolderIcon,
}

export function MediaMetricCards() {
  const metricsQuery = useQuery({
    queryKey: tenantQueryKeys.media.metrics(),
    queryFn: () => mediaService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={HardDriveIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Media KPI cards could not be loaded. Please try again."
      className="sm:grid-cols-2 xl:grid-cols-3"
      skeletonCount={3}
    />
  )
}
