import type { Tenant } from "@/types/central/tenant"
import type { Plan } from "@/types/central/plan"

export type PaymentProvider = "stripe" | "paystack"

export type BillingCycle = "monthly" | "yearly"

export interface SignupPayload {
  name: string
  slug?: string
  database?: string
  domain: string
  plan_id: string
  billing_cycle: BillingCycle
  owner_email: string
  owner_name: string
  payment_provider: PaymentProvider
  success_url?: string
  cancel_url?: string
}

export interface SignupResponse {
  tenant: Tenant
  requires_payment: boolean
  requires_payment_method: boolean
  checkout_url: string | null
  payment_provider: PaymentProvider
  invoice_id: string | null
}

export interface PaymentConfig {
  stripe: {
    public_key: string | null
  }
  paystack: {
    public_key: string | null
  }
  checkout: {
    callback_url: string
    frontend_success_url: string
    cancel_url: string
  }
  trial_setup_amount: number
}

export type PublicPlan = Plan
