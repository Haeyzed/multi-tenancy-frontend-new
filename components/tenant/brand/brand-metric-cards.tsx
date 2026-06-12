"use client"

import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2Icon,
  ImageIcon,
  TagIcon,
  XCircleIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { brandService } from "@/services/tenant/brand.service"

const metricIcons: Record<string, LucideIcon> = {
  total: TagIcon,
  active: CheckCircle2Icon,
  inactive: XCircleIcon,
  with_logo: ImageIcon,
}

export function BrandMetricCards() {
  const metricsQuery = useQuery({
    queryKey: tenantQueryKeys.brands.metrics(),
    queryFn: () => brandService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={TagIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Brand KPI cards could not be loaded. Please try again."
    />
  )
}
