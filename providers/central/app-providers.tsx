"use client"

import { AuthProvider } from "@/providers/central/auth-provider"
import { QueryProvider } from "@/providers/central/query-provider"
import { TenantProvider } from "@/providers/central/tenant-provider"
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <NuqsAdapter>
          <TenantProvider>{children}</TenantProvider>
        </NuqsAdapter>
      </AuthProvider>
    </QueryProvider>
  )
}
