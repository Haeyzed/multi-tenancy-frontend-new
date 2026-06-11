"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { useTenantAuth } from "@/providers/tenant/auth-provider"

export function TenantAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useTenantAuth()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading session...
      </div>
    )
  }

  return <>{children}</>
}
