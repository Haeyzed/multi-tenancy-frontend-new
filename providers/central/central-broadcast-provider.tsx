"use client"

import * as React from "react"

import { useCentralTenantRealtime } from "@/hooks/use-central-tenant-realtime"

export function CentralBroadcastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useCentralTenantRealtime()

  return children
}
