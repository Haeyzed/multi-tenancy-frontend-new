"use client"

import { useQuery } from "@tanstack/react-query"
import {
  ActivityIcon,
  Building2Icon,
  DatabaseIcon,
  NetworkIcon,
  ShoppingCartIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantMetricService } from "@/services/central/tenant-metric.service"
import { useTenant } from "@/providers/central/tenant-provider"

const metricIcons: Record<string, LucideIcon> = {
  tenants_tracked: Building2Icon,
  total_orders: ShoppingCartIcon,
  total_revenue: WalletIcon,
  total_products: DatabaseIcon,
  total_customers: UsersIcon,
  storage_used_mb: DatabaseIcon,
  bandwidth_used_mb: NetworkIcon,
  api_calls: ActivityIcon,
}

export function TenantMetricCards() {
  const { selectedTenantId } = useTenant()

  const metricsQuery = useQuery({
    queryKey: queryKeys.tenantMetrics.metrics(selectedTenantId),
    queryFn: () => tenantMetricService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={ActivityIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="Tenant metric KPI cards could not be loaded. Please try again."
    />
  )
}
