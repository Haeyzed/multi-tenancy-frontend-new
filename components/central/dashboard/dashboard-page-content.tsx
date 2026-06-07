"use client"

import { useQuery } from "@tanstack/react-query"

import { DashboardChartsSection } from "@/components/central/dashboard/dashboard-charts"
import { DashboardMetricCards } from "@/components/central/dashboard/dashboard-metric-cards"
import { DashboardRecentTables } from "@/components/central/dashboard/dashboard-recent-tables"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { queryKeys } from "@/lib/central/query/keys"
import { dashboardService } from "@/services/central/dashboard.service"

export function DashboardPageContent() {
  const overviewQuery = useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: () => dashboardService.getOverview(),
  })

  if (overviewQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load dashboard</CardTitle>
          <CardDescription>
            The dashboard overview could not be loaded. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const overview = overviewQuery.data

  return (
    <div className="flex flex-col gap-6">
      <DashboardMetricCards
        cards={overview?.cards ?? []}
        isLoading={overviewQuery.isLoading}
      />

      {overviewQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="h-[320px] animate-pulse bg-muted/30" />
          ))}
        </div>
      ) : overview?.charts ? (
        <DashboardChartsSection charts={overview.charts} />
      ) : null}

      {overview?.recent ? (
        <DashboardRecentTables recent={overview.recent} />
      ) : null}
    </div>
  )
}
