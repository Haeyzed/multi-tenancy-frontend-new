"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { AlertTriangleIcon } from "lucide-react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantService } from "@/services/central/tenant.service"
import { useTenant } from "@/providers/central/tenant-provider"

const EXPIRING_WINDOW_DAYS = 30

function formatExpiry(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

export function ExpiringTenantsAlert() {
  const { selectedTenantId } = useTenant()

  const expiringQuery = useQuery({
    queryKey: [...queryKeys.tenants.all, "expiring", EXPIRING_WINDOW_DAYS] as const,
    queryFn: () => tenantService.getExpiring(EXPIRING_WINDOW_DAYS),
    enabled: selectedTenantId === null,
  })

  if (selectedTenantId !== null) {
    return null
  }

  if (expiringQuery.isLoading) {
    return <Skeleton className="h-24 w-full" />
  }

  const tenants = expiringQuery.data ?? []

  if (tenants.length === 0) {
    return null
  }

  const preview = tenants.slice(0, 3)
  const remaining = tenants.length - preview.length

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangleIcon />
      <AlertTitle>
        {tenants.length} tenant{tenants.length === 1 ? "" : "s"} expiring within{" "}
        {EXPIRING_WINDOW_DAYS} days
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <ul className="space-y-1 text-sm">
          {preview.map((tenant) => (
            <li key={tenant.id}>
              <span className="font-medium text-foreground">{tenant.name}</span>
              {" — expires "}
              {formatExpiry(tenant.expires_at)}
            </li>
          ))}
          {remaining > 0 ? (
            <li className="text-muted-foreground">
              and {remaining} more tenant{remaining === 1 ? "" : "s"}
            </li>
          ) : null}
        </ul>
        <Button variant="outline" size="sm" render={<Link href="/central/tenants" />}>
          Review tenants
        </Button>
      </AlertDescription>
    </Alert>
  )
}
