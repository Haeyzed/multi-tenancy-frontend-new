"use client"

import { useTenantAuth } from "@/providers/tenant/auth-provider"
import { useTenantBootstrap } from "@/providers/tenant/tenant-bootstrap-provider"

export function TenantDashboardPageContent() {
  const { user } = useTenantAuth()
  const { companyName, bootstrap } = useTenantBootstrap()

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Company</p>
        <p className="mt-1 text-2xl font-semibold">{companyName}</p>
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="mt-1 text-2xl font-semibold">{user?.name ?? "—"}</p>
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Currency</p>
        <p className="mt-1 text-2xl font-semibold">
          {bootstrap?.branding.currency_symbol}{" "}
          {bootstrap?.branding.default_currency}
        </p>
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Primary store</p>
        <p className="mt-1 text-2xl font-semibold">
          {bootstrap?.primary_store?.name ?? "Not configured"}
        </p>
      </div>
    </div>
  )
}
