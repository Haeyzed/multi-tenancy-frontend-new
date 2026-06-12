"use client"

import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2Icon,
  FolderTreeIcon,
  MenuIcon,
  StarIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { categoryService } from "@/services/tenant/category.service"

const metricIcons: Record<string, LucideIcon> = {
  total: FolderTreeIcon,
  active: CheckCircle2Icon,
  featured: StarIcon,
  in_menu: MenuIcon,
}

export function CategoryMetricCards() {
  const metricsQuery = useQuery({
    queryKey: tenantQueryKeys.categories.metrics(),
    queryFn: () => categoryService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={FolderTreeIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Category KPI cards could not be loaded. Please try again."
    />
  )
}
