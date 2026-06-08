"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryStates } from "nuqs"
import { type DateRange } from "react-day-picker"

import { DashboardChartsSection } from "@/components/central/dashboard/dashboard-charts"
import { DashboardMetricCards } from "@/components/central/dashboard/dashboard-metric-cards"
import { DashboardRecentTables } from "@/components/central/dashboard/dashboard-recent-tables"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  dashboardDateRangeToParams,
  formatDashboardDateRangeLabel,
  getDefaultDashboardDateRange,
} from "@/lib/central/dashboard/date-range"
import { queryKeys } from "@/lib/central/query/keys"
import { dashboardService } from "@/services/central/dashboard.service"

function parseStoredDate(value: string | null) {
  if (!value) {
    return undefined
  }

  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export function DashboardPageContent() {
  const defaultRange = React.useMemo(() => getDefaultDashboardDateRange(), [])
  const [{ start_date: startDate, end_date: endDate }, setDateParams] =
    useQueryStates({
      start_date: parseAsString,
      end_date: parseAsString,
    })

  const dateRange = React.useMemo<DateRange>(() => {
    return {
      from: parseStoredDate(startDate) ?? defaultRange.from,
      to: parseStoredDate(endDate) ?? defaultRange.to,
    }
  }, [defaultRange.from, defaultRange.to, endDate, startDate])

  const queryParams = React.useMemo(
    () => dashboardDateRangeToParams(dateRange),
    [dateRange],
  )

  const overviewQuery = useQuery({
    queryKey: queryKeys.dashboard.overview(queryParams),
    queryFn: () => dashboardService.getOverview(queryParams),
  })

  const handleDateRangeChange = React.useCallback(
    (range: DateRange | undefined) => {
      const nextRange = range ?? defaultRange
      const params = dashboardDateRangeToParams(nextRange)

      void setDateParams({
        start_date: params?.start_date ?? null,
        end_date: params?.end_date ?? null,
      })
    },
    [defaultRange, setDateParams],
  )

  const rangeLabel = formatDashboardDateRangeLabel(dateRange)

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Date range</p>
          <p className="text-xs text-muted-foreground">
            Filter KPI cards, charts, and recent activity tables.
          </p>
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          className="w-full sm:w-[280px]"
        />
      </div>

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
        <DashboardChartsSection charts={overview.charts} rangeLabel={rangeLabel} />
      ) : null}

      {overview?.recent ? (
        <DashboardRecentTables recent={overview.recent} rangeLabel={rangeLabel} />
      ) : null}
    </div>
  )
}
