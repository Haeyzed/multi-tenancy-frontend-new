"use client"

import { TenantAppProviders } from "@/providers/tenant/app-providers"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TenantAppProviders>{children}</TenantAppProviders>
}
