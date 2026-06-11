"use client"

import { useQueryClient } from "@tanstack/react-query"
import * as React from "react"
import { toast } from "sonner"

import { connectEcho, disconnectEcho } from "@/lib/central/broadcast/echo"
import { Permissions } from "@/lib/central/auth/permissions"
import { getAuthToken } from "@/lib/central/auth/token-storage"
import { queryKeys } from "@/lib/central/query/keys"
import { useAuth } from "@/providers/central/auth-provider"
import { broadcastService } from "@/services/central/broadcast.service"
import type { User } from "@/types/central/auth"
import type { CentralTenantBroadcastPayload } from "@/types/central/broadcast"

function canViewTenants(user: User | null): boolean {
  if (!user) {
    return false
  }

  if (user.is_super_admin) {
    return true
  }

  return user.permission_names?.includes(Permissions.tenants.view) ?? false
}

export function useCentralTenantRealtime(): void {
  const { isAuthenticated, user } = useAuth()
  const queryClient = useQueryClient()

  const refreshTenants = React.useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all })
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
  }, [queryClient])

  React.useEffect(() => {
    if (!isAuthenticated || !canViewTenants(user)) {
      disconnectEcho()
      return
    }

    const token = getAuthToken()

    if (!token) {
      return
    }

    let cancelled = false

    async function subscribe() {
      try {
        const config = await broadcastService.getConfig()

        if (cancelled) {
          return
        }

        const echo = connectEcho(config, token!)
        const channel = echo.private(config.channel)

        channel.listen(".tenant.registered", (payload: CentralTenantBroadcastPayload) => {
          refreshTenants()
          toast.info(`New tenant registered: ${payload.tenant.name}`)
        })

        channel.listen(".tenant.onboarded", (payload: CentralTenantBroadcastPayload) => {
          refreshTenants()
          toast.success(`Tenant onboarded: ${payload.tenant.name}`)
        })
      } catch {
        if (!cancelled) {
          disconnectEcho()
        }
      }
    }

    void subscribe()

    return () => {
      cancelled = true
      disconnectEcho()
    }
  }, [isAuthenticated, user, refreshTenants])
}
