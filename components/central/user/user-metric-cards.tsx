"use client"

import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2Icon,
  ClockIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UserCheckIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { MetricCardsGrid } from "@/components/central/metric/metric-cards-grid"
import { queryKeys } from "@/lib/central/query/keys"
import { userService } from "@/services/central/user.service"

const metricIcons: Record<string, LucideIcon> = {
  total: UsersIcon,
  active: UserCheckIcon,
  inactive: XCircleIcon,
  verified: CheckCircle2Icon,
  with_roles: ShieldIcon,
  recent_login: ClockIcon,
  super_admin: ShieldCheckIcon,
}

export function UserMetricCards() {
  const metricsQuery = useQuery({
    queryKey: queryKeys.users.metrics(),
    queryFn: () => userService.getMetrics(),
  })

  return (
    <MetricCardsGrid
      cards={metricsQuery.data?.cards ?? []}
      iconMap={metricIcons}
      defaultIcon={UsersIcon}
      isLoading={metricsQuery.isLoading}
      isError={metricsQuery.isError}
      errorDescription="User KPI cards could not be loaded. Please try again."
    />
  )
}
