"use client"

import {
  AlertCircleIcon,
  Building2Icon,
  CreditCardIcon,
  HeadphonesIcon,
  LayoutDashboardIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import type { DashboardMetricCard } from "@/types/central/dashboard"

const metricIcons: Record<string, LucideIcon> = {
  tenants_total: Building2Icon,
  tenants_active: Building2Icon,
  tenants_on_trial: TrendingUpIcon,
  subscriptions_active: CreditCardIcon,
  subscriptions_trialing: CreditCardIcon,
  revenue_collected: CreditCardIcon,
  users_total: UsersIcon,
  users_active: UsersIcon,
  tickets_open: HeadphonesIcon,
  tickets_urgent: AlertCircleIcon,
  errors_unresolved: AlertCircleIcon,
}

interface DashboardMetricCardsProps {
  cards: DashboardMetricCard[]
  isLoading?: boolean
}

export function DashboardMetricCards({
  cards,
  isLoading = false,
}: DashboardMetricCardsProps) {
  return (
    <MetricCardsGrid
      cards={cards}
      iconMap={metricIcons}
      defaultIcon={LayoutDashboardIcon}
      isLoading={isLoading}
      emptyDescription="Your role does not include module permissions for dashboard KPIs."
      skeletonCount={Math.min(cards.length || 4, 8)}
    />
  )
}
