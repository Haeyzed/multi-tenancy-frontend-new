"use client"

import { useQuery } from "@tanstack/react-query"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  MegaphoneIcon,
  RadioIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { announcementService } from "@/services/central/announcement.service"

const metricIcons: Record<string, LucideIcon> = {
  total: MegaphoneIcon,
  active: CheckCircle2Icon,
  live: RadioIcon,
  alerts: AlertTriangleIcon,
}

export function AnnouncementMetricCards() {
  const metricsQuery = useQuery({
    queryKey: queryKeys.announcements.metrics(),
    queryFn: () => announcementService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={MegaphoneIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Announcement KPI cards could not be loaded. Please try again."
    />
  )
}
