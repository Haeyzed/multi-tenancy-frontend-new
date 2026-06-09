import { formatBillingMetricValue } from "@/lib/central/billing/format-money"

export type MetricCardTheme =
  | "brand"
  | "billing"
  | "users"
  | "support"
  | "danger"
  | "neutral"

const moduleThemes: Record<string, MetricCardTheme> = {
  tenants: "brand",
  billing: "billing",
  users: "users",
  support: "support",
}

const keyThemes: Record<string, MetricCardTheme> = {
  tenants_total: "brand",
  tenants_active: "brand",
  tenants_on_trial: "brand",
  subscriptions_active: "billing",
  subscriptions_trialing: "billing",
  revenue_collected: "billing",
  users_total: "users",
  users_active: "users",
  tickets_open: "support",
  tickets_urgent: "danger",
  errors_unresolved: "danger",
  suspended: "danger",
  cancelled: "danger",
  inactive: "danger",
  total: "neutral",
  active: "brand",
  trialing: "brand",
  past_due: "danger",
  paused: "support",
  expired: "neutral",
  public: "billing",
  with_features: "billing",
  with_permissions: "users",
  web_guard: "users",
  with_module: "users",
  modules: "users",
  verified: "brand",
  with_roles: "users",
  recent_login: "support",
  super_admin: "users",
  pending: "neutral",
  on_trial: "brand",
  expiring_soon: "support",
}

const moduleLabels: Record<string, string> = {
  tenants: "Tenants",
  billing: "Billing",
  users: "Users",
  support: "Support",
}

export function getMetricCardTheme(
  key: string,
  module?: string
): MetricCardTheme {
  if (module && moduleThemes[module]) {
    return moduleThemes[module]
  }

  if (keyThemes[key]) {
    return keyThemes[key]
  }

  if (key.includes("revenue") || key.includes("subscription")) {
    return "billing"
  }

  if (key.includes("ticket") || key.includes("support")) {
    return "support"
  }

  if (
    key.includes("error") ||
    key.includes("urgent") ||
    key.includes("suspended") ||
    key.includes("cancelled") ||
    key.includes("inactive")
  ) {
    return "danger"
  }

  if (key.includes("user") || key.includes("role") || key.includes("permission")) {
    return "users"
  }

  return "neutral"
}

export function getMetricModuleLabel(module?: string): string | undefined {
  if (!module) {
    return undefined
  }

  return moduleLabels[module]
}

export function formatMetricValue(
  value: number | string,
  key?: string,
): string {
  if (key) {
    return formatBillingMetricValue(key, value)
  }

  return typeof value === "number" ? value.toLocaleString() : value
}
