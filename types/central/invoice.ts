import type { MetricCard } from "@/types/central/tenant"

export const InvoiceStatuses = {
  Draft: "draft",
  Open: "open",
  Paid: "paid",
  Void: "void",
  Uncollectible: "uncollectible",
} as const

export type InvoiceStatus =
  (typeof InvoiceStatuses)[keyof typeof InvoiceStatuses]

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  open: "Open",
  paid: "Paid",
  void: "Void",
  uncollectible: "Uncollectible",
}

export interface InvoiceTenant {
  id: string
  name: string
  slug: string
  domain: string
}

export interface InvoiceSubscription {
  id: string
  plan_id: string
  status: string
  plan?: {
    id: string
    name: string
    slug: string
  } | null
}

export interface InvoicePayment {
  id: string
  amount: number
  currency: string
  status: string
  payment_provider: string
  created_at: string | null
}

export interface Invoice {
  id: string
  tenant_id: string
  subscription_id: string | null
  invoice_number: string
  status: InvoiceStatus
  amount_due: number
  amount_paid: number
  amount_remaining: number
  currency: string
  billing_period_start: string | null
  billing_period_end: string | null
  due_date: string | null
  paid_at: string | null
  pdf_url: string | null
  payment_intent_id: string | null
  line_items: Record<string, unknown>[] | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
  tenant?: InvoiceTenant | null
  subscription?: InvoiceSubscription | null
  payments?: InvoicePayment[]
}

export interface InvoiceListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
}

export type { MetricCard }
