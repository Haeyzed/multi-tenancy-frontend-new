import type { Tenant, TenantFormPayload, TenantStatus } from "@/types/central/tenant"
import { TenantStatuses } from "@/types/central/tenant"

export interface TenantFormState {
  name: string
  slug: string
  database: string
  domain: string
  status: TenantStatus
  planId: string
  billingCycle: "monthly" | "yearly"
  trialEndsAt: string
  subscribedAt: string
  expiresAt: string
  ownerEmail: string
  ownerName: string
}

export function slugifyTenantName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function databaseFromSlug(slug: string): string {
  const normalized = slug.trim().replace(/-/g, "_")

  return normalized ? `tenant_${normalized}` : ""
}

export function domainFromSlug(slug: string): string {
  const normalized = slug.trim()

  return normalized ? `${normalized}.example.com` : ""
}

function isoToDatetimeLocal(value: string | null | undefined): string {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60_000)

  return local.toISOString().slice(0, 16)
}

function datetimeLocalToIso(value: string): string | null {
  if (!value.trim()) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

export function defaultTenantFormState(): TenantFormState {
  return {
    name: "",
    slug: "",
    database: "",
    domain: "",
    status: TenantStatuses.Pending,
    planId: "",
    billingCycle: "monthly",
    trialEndsAt: "",
    subscribedAt: "",
    expiresAt: "",
    ownerEmail: "",
    ownerName: "",
  }
}

export function tenantToFormState(tenant: Tenant | null): TenantFormState {
  if (!tenant) {
    return defaultTenantFormState()
  }

  return {
    name: tenant.name,
    slug: tenant.slug,
    database: tenant.database,
    domain: tenant.domain,
    status: tenant.status,
    planId: tenant.plan_id ?? "",
    billingCycle: tenant.billing_cycle === "yearly" ? "yearly" : "monthly",
    trialEndsAt: isoToDatetimeLocal(tenant.trial_ends_at),
    subscribedAt: isoToDatetimeLocal(tenant.subscribed_at),
    expiresAt: isoToDatetimeLocal(tenant.expires_at),
    ownerEmail: tenant.owner_email,
    ownerName: tenant.owner_name,
  }
}

export function formStateToPayload(state: TenantFormState): TenantFormPayload {
  return {
    name: state.name.trim(),
    slug: state.slug.trim(),
    database: state.database.trim(),
    domain: state.domain.trim(),
    status: state.status,
    plan_id: state.planId.trim() || null,
    billing_cycle: state.billingCycle,
    trial_ends_at: datetimeLocalToIso(state.trialEndsAt),
    subscribed_at: datetimeLocalToIso(state.subscribedAt),
    expires_at: datetimeLocalToIso(state.expiresAt),
    owner_email: state.ownerEmail.trim(),
    owner_name: state.ownerName.trim(),
  }
}
