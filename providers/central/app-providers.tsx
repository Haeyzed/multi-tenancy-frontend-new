"use client"

import { AuthProvider } from "@/providers/central/auth-provider"
import { QueryProvider } from "@/providers/central/query-provider"
import { TenantProvider } from "@/providers/central/tenant-provider"
import { HostAwareProviders } from "@/providers/host-aware-providers"
import { NuqsAdapter } from "nuqs/adapters/next/app"

export function CentralInnerProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <TenantProvider>{children}</TenantProvider>
    </AuthProvider>
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <HostAwareProviders>{children}</HostAwareProviders>
      </NuqsAdapter>
    </QueryProvider>
  )
}
