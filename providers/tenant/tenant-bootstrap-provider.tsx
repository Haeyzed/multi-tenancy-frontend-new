"use client"

import { useQuery } from "@tanstack/react-query"
import * as React from "react"

import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { tenantBootstrapService } from "@/services/tenant/bootstrap.service"
import type { TenantBootstrapPayload } from "@/types/tenant/bootstrap"

interface TenantBootstrapContextValue {
  bootstrap: TenantBootstrapPayload | null
  isLoading: boolean
  error: Error | null
  companyName: string
  refetch: () => Promise<void>
}

const TenantBootstrapContext =
  React.createContext<TenantBootstrapContextValue | null>(null)

export function TenantBootstrapProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const bootstrapQuery = useQuery({
    queryKey: tenantQueryKeys.bootstrap.public(),
    queryFn: () => tenantBootstrapService.getPublic(),
    staleTime: 5 * 60_000,
    retry: 1,
  })

  const companyName =
    bootstrapQuery.data?.branding.company_name ??
    bootstrapQuery.data?.tenant.name ??
    "Store Admin"

  const refetch = React.useCallback(async () => {
    await bootstrapQuery.refetch()
  }, [bootstrapQuery])

  const value = React.useMemo<TenantBootstrapContextValue>(
    () => ({
      bootstrap: bootstrapQuery.data ?? null,
      isLoading: bootstrapQuery.isLoading,
      error: bootstrapQuery.error instanceof Error ? bootstrapQuery.error : null,
      companyName,
      refetch,
    }),
    [
      bootstrapQuery.data,
      bootstrapQuery.error,
      bootstrapQuery.isLoading,
      companyName,
      refetch,
    ],
  )

  return (
    <TenantBootstrapContext.Provider value={value}>
      {children}
    </TenantBootstrapContext.Provider>
  )
}

export function useTenantBootstrap() {
  const context = React.useContext(TenantBootstrapContext)

  if (!context) {
    throw new Error("useTenantBootstrap must be used within TenantBootstrapProvider.")
  }

  return context
}
