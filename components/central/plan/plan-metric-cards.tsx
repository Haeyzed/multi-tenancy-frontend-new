"use client"

import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2Icon,
  GlobeIcon,
  LayersIcon,
  ListChecksIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { planService } from "@/services/central/plan.service"

const metricIcons: Record<string, LucideIcon> = {
  total: LayersIcon,
  active: CheckCircle2Icon,
  public: GlobeIcon,
  with_features: ListChecksIcon,
}

export function PlanMetricCards() {
  const metricsQuery = useQuery({
    queryKey: queryKeys.plans.metrics(),
    queryFn: () => planService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={LayersIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Plan KPI cards could not be loaded. Please try again."
    />
  )
}
