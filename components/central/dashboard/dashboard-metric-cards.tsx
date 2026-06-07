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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No metrics available</CardTitle>
          <CardDescription>
            Your role does not include module permissions for dashboard KPIs.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = metricIcons[card.key] ?? LayoutDashboardIcon

        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{card.label}</CardDescription>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl tabular-nums sm:text-3xl">
                {typeof card.value === "number"
                  ? card.value.toLocaleString()
                  : card.value}
              </CardTitle>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
