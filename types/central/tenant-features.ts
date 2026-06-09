export interface TenantFeatures {
  tenant_id: string
  plan_id: string | null
  entitlements: Record<string, string | number | boolean | null>
  display_features: Record<string, unknown> | null
}
