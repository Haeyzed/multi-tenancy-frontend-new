"use client"

import { useQuery } from "@tanstack/react-query"
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BugIcon,
  FileWarningIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { errorLogService } from "@/services/central/error-log.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  total: BugIcon,
  unresolved: FileWarningIcon,
  unresolved_critical: AlertCircleIcon,
  critical: AlertCircleIcon,
  error: AlertTriangleIcon,
  warning: AlertTriangleIcon,
}

export function ErrorLogMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.errorLogs.metrics(selectedTenantId),
    queryFn: () => errorLogService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={BugIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Error log KPI cards could not be loaded. Please try again."
      getTheme={(card) =>
        card.key.includes("critical") || card.key === "error"
          ? "danger"
          : card.key.includes("unresolved")
            ? "support"
            : "neutral"
      }
    />
  )
}
