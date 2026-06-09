import type { Plan, PlanFormPayload } from "@/types/central/plan"

export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function fromMinorUnits(value: number): string {
  return (value / 100).toFixed(2)
}

export function toMinorUnits(value: string): number {
  const parsed = Number.parseFloat(value)

  if (Number.isNaN(parsed)) {
    return 0
  }

  return Math.round(parsed * 100)
}

export function getDefaultPlanFormValues(): PlanFormPayload {
  return {
    name: "",
    slug: "",
    description: "",
    tier: 1,
    is_active: true,
    is_public: true,
    price_monthly: 0,
    price_yearly: 0,
    currency: "NGN",
    trial_days: 0,
    sort_order: 0,
    features: { highlights: [] },
  }
}

export function planToFormPayload(plan: Plan): PlanFormPayload {
  return {
    name: plan.name,
    slug: plan.slug,
    description: plan.description ?? "",
    tier: plan.tier,
    is_active: plan.is_active,
    is_public: plan.is_public,
    price_monthly: plan.price_monthly,
    price_yearly: plan.price_yearly,
    currency: plan.currency,
    trial_days: plan.trial_days,
    sort_order: plan.sort_order,
    features: plan.display_features ?? { highlights: [] },
  }
}

export function extractHighlights(features: Record<string, unknown>): string[] {
  const highlights = features.highlights

  if (!Array.isArray(highlights)) {
    return []
  }

  return highlights.filter((item): item is string => typeof item === "string")
}

export function buildFeaturesFromHighlights(highlights: string[]): Record<string, unknown> {
  return {
    highlights: highlights.map((item) => item.trim()).filter(Boolean),
  }
}

export function serializeFeaturesJson(features: Record<string, unknown>): string {
  return JSON.stringify(features, null, 2)
}

export function parseFeaturesJson(value: string): Record<string, unknown> {
  const trimmed = value.trim()

  if (!trimmed) {
    return { highlights: [] }
  }

  const parsed = JSON.parse(trimmed) as unknown

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new TypeError("Features must be a JSON object.")
  }

  return parsed as Record<string, unknown>
}

export interface PlanFormState {
  name: string
  slug: string
  description: string
  tier: string
  isActive: boolean
  isPublic: boolean
  priceMonthly: string
  priceYearly: string
  currency: string
  trialDays: string
  sortOrder: string
  highlights: string[]
}

export function formStateFromPlan(plan: Plan | null): PlanFormState {
  if (!plan) {
    const defaults = getDefaultPlanFormValues()

    return {
      name: defaults.name,
      slug: defaults.slug,
      description: defaults.description ?? "",
      tier: String(defaults.tier),
      isActive: defaults.is_active ?? true,
      isPublic: defaults.is_public ?? true,
      priceMonthly: fromMinorUnits(defaults.price_monthly),
      priceYearly: fromMinorUnits(defaults.price_yearly),
      currency: defaults.currency,
      trialDays: String(defaults.trial_days),
      sortOrder: String(defaults.sort_order ?? 0),
      highlights: extractHighlights(defaults.features).length
        ? extractHighlights(defaults.features)
        : [""],
    }
  }

  const payload = planToFormPayload(plan)

  return {
    name: payload.name,
    slug: payload.slug,
    description: payload.description ?? "",
    tier: String(payload.tier),
    isActive: payload.is_active ?? true,
    isPublic: payload.is_public ?? true,
    priceMonthly: fromMinorUnits(payload.price_monthly),
    priceYearly: fromMinorUnits(payload.price_yearly),
    currency: payload.currency,
    trialDays: String(payload.trial_days),
    sortOrder: String(payload.sort_order ?? 0),
    highlights: (() => {
      const items = extractHighlights(payload.features)
      return items.length > 0 ? items : [""]
    })(),
  }
}

export function formStateToPayload(state: PlanFormState): PlanFormPayload {
  return {
    name: state.name.trim(),
    slug: state.slug.trim(),
    description: state.description.trim() || null,
    tier: Number.parseInt(state.tier, 10) || 1,
    is_active: state.isActive,
    is_public: state.isPublic,
    price_monthly: toMinorUnits(state.priceMonthly),
    price_yearly: toMinorUnits(state.priceYearly),
    currency: state.currency.trim().toUpperCase(),
    trial_days: Number.parseInt(state.trialDays, 10) || 0,
    sort_order: Number.parseInt(state.sortOrder, 10) || 0,
    features: buildFeaturesFromHighlights(state.highlights),
  }
}
