"use client"

import { useQuery } from "@tanstack/react-query"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  HeadphonesIcon,
  TicketIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { supportTicketService } from "@/services/central/support-ticket.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  total: TicketIcon,
  open: HeadphonesIcon,
  resolved: CheckCircle2Icon,
  closed: CheckCircle2Icon,
  urgent_open: AlertCircleIcon,
}

export function SupportTicketMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.supportTickets.metrics(selectedTenantId),
    queryFn: () => supportTicketService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={HeadphonesIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Support ticket KPI cards could not be loaded. Please try again."
      getTheme={(card) =>
        card.key === "urgent_open"
          ? "danger"
          : card.key === "open"
            ? "support"
            : "neutral"
      }
    />
  )
}
