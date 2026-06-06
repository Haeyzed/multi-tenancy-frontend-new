"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as React from "react"

import {
  getSelectedTenantId,
  setSelectedTenantId,
} from "@/lib/central/tenant/tenant-storage"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantService } from "@/services/central/tenant.service"
import type { SelectOption } from "@/types/central/api"
import { useAuth } from "@/providers/central/auth-provider"

interface TenantContextValue {
  tenants: SelectOption[]
  selectedTenantId: string | null
  selectedTenant: SelectOption | null
  isLoading: boolean
  selectTenant: (tenantId: string | null) => void
  refetchTenants: () => Promise<void>
}

const TenantContext = React.createContext<TenantContextValue | null>(null)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [selectedTenantId, setSelectedTenantIdState] = React.useState<string | null>(
    () => getSelectedTenantId(),
  )

  const optionsQuery = useQuery({
    queryKey: queryKeys.tenants.options(),
    queryFn: () => tenantService.getOptions(),
    enabled: isAuthenticated,
  })

  const tenants = optionsQuery.data ?? []

  const selectedTenant = React.useMemo(
    () => tenants.find((tenant) => tenant.value === selectedTenantId) ?? null,
    [selectedTenantId, tenants],
  )

  React.useEffect(() => {
    if (!selectedTenantId || tenants.length === 0) {
      return
    }

    const stillExists = tenants.some((tenant) => tenant.value === selectedTenantId)

    if (!stillExists) {
      setSelectedTenantId(null)
      setSelectedTenantIdState(null)
    }
  }, [selectedTenantId, tenants])

  const selectTenant = React.useCallback((tenantId: string | null) => {
    setSelectedTenantId(tenantId)
    setSelectedTenantIdState(tenantId)
    queryClient.invalidateQueries()
  }, [queryClient])

  const refetchTenants = React.useCallback(async () => {
    await optionsQuery.refetch()
  }, [optionsQuery])

  const value = React.useMemo<TenantContextValue>(
    () => ({
      tenants,
      selectedTenantId,
      selectedTenant,
      isLoading: optionsQuery.isLoading,
      selectTenant,
      refetchTenants,
    }),
    [
      optionsQuery.isLoading,
      refetchTenants,
      selectTenant,
      selectedTenant,
      selectedTenantId,
      tenants,
    ],
  )

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  )
}

export function useTenant() {
  const context = React.useContext(TenantContext)

  if (!context) {
    throw new Error("useTenant must be used within TenantProvider.")
  }

  return context
}
