import type { Tenant } from "@/types/central/tenant"

export const ErrorLogSeverities = {
  Debug: "debug",
  Info: "info",
  Warning: "warning",
  Error: "error",
  Critical: "critical",
} as const

export type ErrorLogSeverity =
  (typeof ErrorLogSeverities)[keyof typeof ErrorLogSeverities]

export const errorLogSeverityLabels: Record<ErrorLogSeverity, string> = {
  debug: "Debug",
  info: "Info",
  warning: "Warning",
  error: "Error",
  critical: "Critical",
}

export interface ErrorLog {
  id: number
  tenant_id: string | null
  severity: ErrorLogSeverity
  channel: string
  message: string
  context: Record<string, unknown> | null
  occurred_at: string | null
  resolved_at: string | null
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
}

export interface ErrorLogListParams {
  page?: number
  per_page?: number
  search?: string
  severity?: string
  resolution?: string
}
