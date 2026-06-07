"use client"

import { useQuery } from "@tanstack/react-query"
import {
  AlertCircleIcon,
  BanIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  PauseCircleIcon,
  SparklesIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { subscriptionService } from "@/services/central/subscription.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  total: CreditCardIcon,
  active: CheckCircle2Icon,
  trialing: SparklesIcon,
  past_due: AlertCircleIcon,
  cancelled: BanIcon,
  paused: PauseCircleIcon,
  expired: ClockIcon,
}

export function SubscriptionMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.subscriptions.metrics(selectedTenantId),
    queryFn: () => subscriptionService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={CreditCardIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Subscription KPI cards could not be loaded. Please try again."
    />
  )
}
