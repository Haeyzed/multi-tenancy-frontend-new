"use client"

import { useQuery } from "@tanstack/react-query"
import {
  BanIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  WalletIcon,
  XCircleIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { paymentService } from "@/services/central/payment.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  total: CreditCardIcon,
  succeeded: CheckCircle2Icon,
  pending: ClockIcon,
  failed: XCircleIcon,
  refunded: BanIcon,
  total_collected: WalletIcon,
  total_refunded: BanIcon,
}

export function PaymentMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.payments.metrics(selectedTenantId),
    queryFn: () => paymentService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={CreditCardIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Payment KPI cards could not be loaded. Please try again."
    />
  )
}
