import type { Tenant } from "@/types/central/tenant"

export interface BroadcastConfig {
  driver: "reverb"
  key: string
  host: string
  port: number
  scheme: "http" | "https"
  auth_endpoint: string
  channel: string
}

export type CentralTenantBroadcastEvent = "tenant.registered" | "tenant.onboarded"

export interface CentralTenantBroadcastPayload {
  event: CentralTenantBroadcastEvent
  tenant: Tenant
}
