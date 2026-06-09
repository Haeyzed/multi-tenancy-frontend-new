"use client"

import { useQuery } from "@tanstack/react-query"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
  WalletIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { invoiceService } from "@/services/central/invoice.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  total: FileTextIcon,
  open: ClockIcon,
  paid: CheckCircle2Icon,
  overdue: AlertCircleIcon,
  overdue_amount: AlertCircleIcon,
  outstanding_amount: WalletIcon,
  collected_amount: CheckCircle2Icon,
}

export function InvoiceMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.invoices.metrics(selectedTenantId),
    queryFn: () => invoiceService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={FileTextIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Invoice KPI cards could not be loaded. Please try again."
    />
  )
}
