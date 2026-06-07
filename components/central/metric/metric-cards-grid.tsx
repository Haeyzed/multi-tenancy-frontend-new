import type { LucideIcon } from "lucide-react"

import { MetricCardItem } from "@/components/central/metric/metric-card-item"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MetricCardTheme } from "@/lib/central/metric/utils"
import { cn } from "@/lib/utils"
import type { MetricCard } from "@/types/central/tenant"

interface MetricCardsGridProps {
  cards: (MetricCard & { module?: string })[]
  iconMap: Record<string, LucideIcon>
  defaultIcon: LucideIcon
  isLoading?: boolean
  isError?: boolean
  errorTitle?: string
  errorDescription?: string
  emptyTitle?: string
  emptyDescription?: string
  className?: string
  skeletonCount?: number
  getTheme?: (card: MetricCard & { module?: string }) => MetricCardTheme
  getModuleLabel?: (card: MetricCard & { module?: string }) => string | undefined
}

function MetricCardSkeleton() {
  return (
    <Card className="app-metric-card app-metric-card--neutral">
      <div className="app-metric-card-glow" aria-hidden="true" />
      <CardContent className="relative flex flex-col gap-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="size-10 rounded-xl" />
        </div>
        <Skeleton className="h-9 w-20" />
      </CardContent>
    </Card>
  )
}

export function MetricCardsGrid({
  cards,
  iconMap,
  defaultIcon,
  isLoading = false,
  isError = false,
  errorTitle = "Unable to load metrics",
  errorDescription = "KPI cards could not be loaded. Please try again.",
  emptyTitle = "No metrics available",
  emptyDescription = "There are no KPI cards to display for your current access.",
  className,
  skeletonCount = 4,
  getTheme,
  getModuleLabel,
}: MetricCardsGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{errorTitle}</CardTitle>
          <CardDescription>{errorDescription}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{emptyTitle}</CardTitle>
          <CardDescription>{emptyDescription}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
    >
      {cards.map((card) => {
        const Icon = iconMap[card.key] ?? defaultIcon

        return (
          <MetricCardItem
            key={card.key}
            card={card}
            icon={Icon}
            theme={getTheme?.(card)}
            moduleLabel={getModuleLabel?.(card)}
          />
        )
      })}
    </div>
  )
}
