import type { Subscription } from "@/types/central/subscription"
import type { Tenant } from "@/types/central/tenant"

export const UsageMetrics = {
  Products: "products",
  Orders: "orders",
  Storage: "storage",
  Bandwidth: "bandwidth",
  Staff: "staff",
  Transactions: "transactions",
  ApiCalls: "api_calls",
} as const

export type UsageMetric = (typeof UsageMetrics)[keyof typeof UsageMetrics]

export const usageMetricLabels: Record<UsageMetric, string> = {
  products: "Products",
  orders: "Orders",
  storage: "Storage",
  bandwidth: "Bandwidth",
  staff: "Staff",
  transactions: "Transactions",
  api_calls: "API Calls",
}

export interface UsageRecord {
  id: number
  tenant_id: string
  subscription_id: string | null
  metric: UsageMetric | string
  quantity: string | number
  recorded_at: string
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
  subscription?: Subscription | null
}

export interface UsageRecordFormPayload {
  tenant_id: string
  subscription_id?: string | null
  metric: UsageMetric | string
  quantity: number
  recorded_at: string
}

export interface UsageRecordListParams {
  page?: number
  per_page?: number
  search?: string
  metric?: string
}
