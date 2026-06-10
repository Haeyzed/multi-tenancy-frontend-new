"use client"

import { useQuery } from "@tanstack/react-query"
import {
  ActivityIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  HelpCircleIcon,
  TimerIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { healthCheckService } from "@/services/central/health-check.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  total: ActivityIcon,
  healthy: CheckCircle2Icon,
  warning: AlertTriangleIcon,
  critical: AlertCircleIcon,
  unknown: HelpCircleIcon,
  avg_response_time_ms: TimerIcon,
}

export function HealthCheckMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.healthChecks.metrics(selectedTenantId),
    queryFn: () => healthCheckService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={ActivityIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Health check KPI cards could not be loaded. Please try again."
      getTheme={(card) =>
        card.key === "critical"
          ? "danger"
          : card.key === "warning"
            ? "support"
            : card.key === "healthy"
              ? "brand"
              : "neutral"
      }
    />
  )
}
