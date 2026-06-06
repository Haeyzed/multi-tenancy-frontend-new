export const FeatureTypes = {
  Boolean: "boolean",
  Integer: "integer",
  String: "string",
  Decimal: "decimal",
} as const

export type FeatureType = (typeof FeatureTypes)[keyof typeof FeatureTypes]

export interface PlanFeature {
  id: number
  plan_id: string
  feature_key: string
  feature_value: string
  feature_type: FeatureType
  created_at: string | null
  updated_at: string | null
}

export interface PlanFeatureFormPayload {
  plan_id: string
  feature_key: string
  feature_value: string
  feature_type: FeatureType
}

export interface PlanFeatureListParams {
  page?: number
  per_page?: number
  plan_id?: string
}

export const featureTypeLabels: Record<FeatureType, string> = {
  boolean: "Boolean",
  integer: "Integer",
  string: "String",
  decimal: "Decimal",
}
