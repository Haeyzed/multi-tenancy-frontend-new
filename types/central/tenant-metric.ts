import type { MetricCard, Tenant } from "@/types/central/tenant"

export interface TenantMetric {
  id: number
  tenant_id: string
  metric_date: string
  total_orders: number
  total_revenue: string | number
  total_products: number
  total_customers: number
  storage_used_mb: number
  bandwidth_used_mb: number
  api_calls: number
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
}

export interface TenantMetricFormPayload {
  tenant_id: string
  metric_date: string
  total_orders?: number
  total_revenue?: number
  total_products?: number
  total_customers?: number
  storage_used_mb?: number
  bandwidth_used_mb?: number
  api_calls?: number
}

export interface TenantMetricListParams {
  page?: number
  per_page?: number
  search?: string
  start_date?: string
  end_date?: string
}

export type { MetricCard }
