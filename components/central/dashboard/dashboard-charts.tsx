"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { DashboardCharts } from "@/types/central/dashboard"

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const tenantGrowthConfig = {
  count: { label: "New tenants", color: "var(--chart-1)" },
} satisfies ChartConfig

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-2)" },
} satisfies ChartConfig

const tenantStatusConfig = {
  count: { label: "Tenants", color: "var(--chart-1)" },
} satisfies ChartConfig

const subscriptionStatusConfig = {
  count: { label: "Subscriptions", color: "var(--chart-3)" },
} satisfies ChartConfig

function formatChartDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

function formatRevenue(value: number) {
  const major = value / 100

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(major)
}

interface DashboardChartsProps {
  charts: DashboardCharts
  rangeLabel?: string
}

export function DashboardChartsSection({
  charts,
  rangeLabel = "selected range",
}: DashboardChartsProps) {
  const hasTenantGrowth = (charts.tenant_growth?.length ?? 0) > 0
  const hasRevenue = (charts.revenue_over_time?.length ?? 0) > 0
  const hasTenantStatus = (charts.tenant_status?.length ?? 0) > 0
  const hasSubscriptionStatus = (charts.subscription_status?.length ?? 0) > 0

  if (!hasTenantGrowth && !hasRevenue && !hasTenantStatus && !hasSubscriptionStatus) {
    return null
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {hasRevenue ? (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue over time</CardTitle>
            <CardDescription>
              Successful payments for {rangeLabel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="aspect-auto h-[280px] w-full">
              <AreaChart data={charts.revenue_over_time} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={formatChartDate}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={72}
                  tickFormatter={(value) => formatRevenue(Number(value))}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => formatChartDate(String(value))}
                      formatter={(value) => formatRevenue(Number(value))}
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="var(--color-revenue)"
                  fillOpacity={0.25}
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}

      {hasTenantGrowth ? (
        <Card>
          <CardHeader>
            <CardTitle>Tenant growth</CardTitle>
            <CardDescription>New tenants per day for {rangeLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={tenantGrowthConfig} className="aspect-auto h-[260px] w-full">
              <BarChart data={charts.tenant_growth} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={formatChartDate}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => formatChartDate(String(value))}
                    />
                  }
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}

      {hasTenantStatus ? (
        <Card>
          <CardHeader>
            <CardTitle>Tenant status</CardTitle>
            <CardDescription>Distribution by lifecycle status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={tenantStatusConfig} className="aspect-auto h-[260px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                <Pie
                  data={charts.tenant_status}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {charts.tenant_status?.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="label" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}

      {hasSubscriptionStatus ? (
        <Card className={hasTenantGrowth && !hasTenantStatus ? "" : "lg:col-span-2"}>
          <CardHeader>
            <CardTitle>Subscription status</CardTitle>
            <CardDescription>Current subscription distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={subscriptionStatusConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                <Pie
                  data={charts.subscription_status}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {charts.subscription_status?.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="label" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
