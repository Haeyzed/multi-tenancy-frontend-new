"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { useAuth } from "@/providers/central/auth-provider"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/central/login")
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
