import type { MetricCard } from "@/types/central/tenant"

export const PaymentStatuses = {
  Pending: "pending",
  Succeeded: "succeeded",
  Failed: "failed",
  Refunded: "refunded",
} as const

export type PaymentStatus =
  (typeof PaymentStatuses)[keyof typeof PaymentStatuses]

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  succeeded: "Succeeded",
  failed: "Failed",
  refunded: "Refunded",
}

export interface PaymentTenant {
  id: string
  name: string
  slug: string
  domain: string
}

export interface PaymentInvoice {
  id: string
  invoice_number: string
  status: string
  amount_due: number
  currency: string
}

export interface Payment {
  id: string
  tenant_id: string
  invoice_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  payment_provider: string
  provider_payment_id: string | null
  payment_method_type: string | null
  payment_method_last4: string | null
  payment_method_brand: string | null
  failure_message: string | null
  refunded_amount: number
  created_at: string | null
  updated_at: string | null
  tenant?: PaymentTenant | null
  invoice?: PaymentInvoice | null
}

export interface PaymentListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
}

export type { MetricCard }
