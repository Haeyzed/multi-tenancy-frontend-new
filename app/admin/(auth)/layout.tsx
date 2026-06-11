"use client"

import { TenantAuthShell } from "@/components/tenant/auth/auth-shell"
import { useTenantBootstrap } from "@/providers/tenant/tenant-bootstrap-provider"

export default function TenantAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { companyName, bootstrap, isLoading } = useTenantBootstrap()

  if (isLoading && !bootstrap) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading store configuration...
      </div>
    )
  }

  return (
    <TenantAuthShell
      companyName={companyName}
      logoUrl={bootstrap?.primary_store?.logo_url}
    >
      {children}
    </TenantAuthShell>
  )
}
