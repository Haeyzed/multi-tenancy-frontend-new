"use client"

import { TenantAuthProvider } from "@/providers/tenant/auth-provider"
import { TenantBootstrapProvider } from "@/providers/tenant/tenant-bootstrap-provider"

export function TenantAppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TenantBootstrapProvider>
      <TenantAuthProvider>{children}</TenantAuthProvider>
    </TenantBootstrapProvider>
  )
}
