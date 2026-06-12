"use client"

import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  FolderTreeIcon,
  PackageIcon,
  StarIcon,
  TagIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { productService } from "@/services/tenant/product.service"

const metricIcons: Record<string, LucideIcon> = {
  total: PackageIcon,
  active: CheckCircle2Icon,
  draft: CircleDashedIcon,
  featured: StarIcon,
  with_brand: TagIcon,
  with_category: FolderTreeIcon,
}

export function ProductMetricCards() {
  const metricsQuery = useQuery({
    queryKey: tenantQueryKeys.products.metrics(),
    queryFn: () => productService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={PackageIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Product KPI cards could not be loaded. Please try again."
    />
  )
}
