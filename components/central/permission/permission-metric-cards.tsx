"use client"

import { useQuery } from "@tanstack/react-query"
import { FolderIcon, KeyRoundIcon, ShieldIcon } from "lucide-react"
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
import { permissionService } from "@/services/central/permission.service"

const metricIcons: Record<string, LucideIcon> = {
  total: KeyRoundIcon,
  with_module: FolderIcon,
  modules: ShieldIcon,
}

export function PermissionMetricCards() {
  const metricsQuery = useQuery({
    queryKey: queryKeys.permissions.metrics(),
    queryFn: () => permissionService.getMetrics(),
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
            Permission KPI cards could not be loaded. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = metricIcons[card.key] ?? KeyRoundIcon

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
