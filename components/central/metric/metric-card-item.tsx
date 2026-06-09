import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardDescription } from "@/components/ui/card"
import {
  formatMetricValue,
  getMetricCardTheme,
  getMetricModuleLabel,
  type MetricCardTheme,
} from "@/lib/central/metric/utils"
import { cn } from "@/lib/utils"
import type { MetricCard } from "@/types/central/tenant"

interface MetricCardItemProps {
  card: MetricCard & { module?: string }
  icon: LucideIcon
  theme?: MetricCardTheme
  moduleLabel?: string
}

export function MetricCardItem({
  card,
  icon: Icon,
  theme,
  moduleLabel,
}: MetricCardItemProps) {
  const resolvedTheme = theme ?? getMetricCardTheme(card.key, card.module)
  const resolvedModuleLabel =
    moduleLabel ?? getMetricModuleLabel(card.module)

  return (
    <Card
      className={cn("app-metric-card", `app-metric-card--${resolvedTheme}`)}
    >
      <div className="app-metric-card-glow" aria-hidden="true" />

      <CardContent className="relative flex flex-col gap-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              {card.label}
            </CardDescription>
          </div>
          <div className="app-metric-card-icon shrink-0">
            <Icon className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="app-metric-card-value">
            {formatMetricValue(card.value, card.key)}
          </p>
          {resolvedModuleLabel ? (
            <span className="app-metric-card-chip">{resolvedModuleLabel}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
