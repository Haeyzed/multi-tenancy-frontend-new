import type { Tenant } from "@/types/central/tenant"

export const HealthCheckStatuses = {
  Healthy: "healthy",
  Warning: "warning",
  Critical: "critical",
  Unknown: "unknown",
} as const

export type HealthCheckStatus =
  (typeof HealthCheckStatuses)[keyof typeof HealthCheckStatuses]

export const healthCheckStatusLabels: Record<HealthCheckStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  unknown: "Unknown",
}

export const HealthCheckTypes = {
  DbConnectivity: "db_connectivity",
  Storage: "storage",
  Queue: "queue",
  Ssl: "ssl",
  Redis: "redis",
  Search: "search",
} as const

export type HealthCheckType =
  (typeof HealthCheckTypes)[keyof typeof HealthCheckTypes]

export const healthCheckTypeLabels: Record<HealthCheckType, string> = {
  db_connectivity: "Database",
  storage: "Storage",
  queue: "Queue",
  ssl: "SSL",
  redis: "Redis",
  search: "Search",
}

export interface HealthCheck {
  id: number
  tenant_id: string
  check_type: HealthCheckType
  status: HealthCheckStatus
  response_time_ms: number | null
  message: string | null
  checked_at: string | null
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
}

export interface HealthCheckListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
}
