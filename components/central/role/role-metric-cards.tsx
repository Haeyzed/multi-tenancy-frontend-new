"use client"

import { useQuery } from "@tanstack/react-query"
import { KeyRoundIcon, ShieldCheckIcon, ShieldIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { queryKeys } from "@/lib/central/query/keys"
import { roleService } from "@/services/central/role.service"

const metricIcons: Record<string, LucideIcon> = {
  total: ShieldIcon,
  with_permissions: ShieldCheckIcon,
  web_guard: KeyRoundIcon,
}

export function RoleMetricCards() {
  const metricsQuery = useQuery({
    queryKey: queryKeys.roles.metrics(),
    queryFn: () => roleService.getMetrics(),
  })

  const cards = metricsQuery.data?.cards ?? []

  if (metricsQuery.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
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

  if (metricsQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load metrics</CardTitle>
          <CardDescription>
            Role KPI cards could not be loaded. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = metricIcons[card.key] ?? ShieldIcon

        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{card.label}</CardDescription>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl tabular-nums">
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
