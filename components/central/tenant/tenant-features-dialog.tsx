"use client"

import { useQuery } from "@tanstack/react-query"
import { SparklesIcon } from "lucide-react"
import * as React from "react"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantService } from "@/services/central/tenant.service"
import type { Tenant } from "@/types/central/tenant"

interface TenantFeaturesDialogProps {
  tenant: Tenant
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getHighlightItems(
  features: Record<string, unknown> | null | undefined,
): string[] {
  if (!features) {
    return []
  }

  const highlights = features.highlights

  if (!Array.isArray(highlights)) {
    return []
  }

  return highlights.filter(
    (item): item is string => typeof item === "string" && item.trim() !== "",
  )
}

function formatEntitlementValue(value: unknown) {
  if (value === null || value === undefined) {
    return "—"
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  return String(value)
}

export function TenantFeaturesDialog({
  tenant,
  open,
  onOpenChange,
}: TenantFeaturesDialogProps) {
  const featuresQuery = useQuery({
    queryKey: [...queryKeys.tenants.all, "features", tenant.id] as const,
    queryFn: () => tenantService.getFeatures(tenant.id),
    enabled: open,
  })

  const features = featuresQuery.data
  const entitlementEntries = Object.entries(features?.entitlements ?? {}).sort(
    ([left], [right]) => left.localeCompare(right),
  )
  const highlights = getHighlightItems(features?.display_features ?? null)

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="flex items-center gap-2">
            <SparklesIcon className="size-5" />
            Plan entitlements
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Resolved feature limits for {tenant.name} based on the assigned plan.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {featuresQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : featuresQuery.isError ? (
          <p className="text-sm text-muted-foreground">
            Unable to load tenant features. Please try again.
          </p>
        ) : entitlementEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No plan entitlements are configured for this tenant.
          </p>
        ) : (
          <div className="max-h-[360px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entitlementEntries.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{formatEntitlementValue(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {highlights.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Plan highlights</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
