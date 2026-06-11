"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

import { getClientHostContext } from "@/lib/tenant/domain/resolve-host"
import { CentralInnerProviders } from "@/providers/central/app-providers"

export function HostAwareProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return <>{children}</>
  }

  const [mode] = React.useState<"central" | "tenant">(() => {
    if (typeof window === "undefined") {
      return "central"
    }

    return getClientHostContext().mode
  })

  if (mode === "tenant") {
    return <>{children}</>
  }

  return <CentralInnerProviders>{children}</CentralInnerProviders>
}
