export interface TenantBootstrapTenant {
  id: string
  name: string
  slug: string
}

export interface TenantBootstrapBranding {
  company_name: string | null
  legal_name: string | null
  support_email: string | null
  support_phone: string | null
  support_whatsapp: string | null
  website_url: string | null
  default_currency: string
  currency_symbol: string
  currency_position: "before" | "after"
  default_timezone: string
  default_language: string
  social_links: Record<string, string> | null
  privacy_policy_url: string | null
  terms_of_service_url: string | null
  refund_policy_url: string | null
}

export interface TenantBootstrapPrimaryStore {
  id: string
  name: string
  slug: string
  tagline: string | null
  logo_url: string | null
  favicon_url: string | null
}

export interface TenantBootstrapPayload {
  tenant: TenantBootstrapTenant
  branding: TenantBootstrapBranding
  primary_store: TenantBootstrapPrimaryStore | null
}
