import type { Tenant } from "@/types/central/tenant"

export interface PaymentMethodBillingDetails {
  authorization_code?: string | null
  bin?: string | null
  bank?: string | null
  name?: string | null
  email?: string | null
}

export interface PaymentMethod {
  id: number
  tenant_id: string
  provider: string
  provider_method_id: string
  type: string
  last4: string | null
  brand: string | null
  exp_month: number | null
  exp_year: number | null
  is_default: boolean
  billing_details: PaymentMethodBillingDetails | null
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
}

export interface PaymentMethodListParams {
  page?: number
  per_page?: number
  search?: string
}
