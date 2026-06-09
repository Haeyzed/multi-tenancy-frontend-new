export const AnnouncementTypes = {
  Maintenance: "maintenance",
  Feature: "feature",
  Alert: "alert",
  Info: "info",
} as const

export type AnnouncementType =
  (typeof AnnouncementTypes)[keyof typeof AnnouncementTypes]

export const AnnouncementTargetAudiences = {
  All: "all",
  PlanSpecific: "plan_specific",
  AdminsOnly: "admins_only",
} as const

export type AnnouncementTargetAudience =
  (typeof AnnouncementTargetAudiences)[keyof typeof AnnouncementTargetAudiences]

export interface PlatformAnnouncement {
  id: number
  title: string
  body: string
  type: AnnouncementType
  target_audience: AnnouncementTargetAudience
  target_plans: string[] | null
  target_plan_names?: string[] | null
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface AnnouncementFormPayload {
  title: string
  body: string
  type: AnnouncementType
  target_audience: AnnouncementTargetAudience
  target_plans?: string[] | null
  is_active?: boolean
  starts_at?: string | null
  ends_at?: string | null
}

export interface AnnouncementListParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: string
  type?: string
  target_audience?: string
}

export type { MetricCard } from "@/types/central/tenant"

export const announcementTypeLabels: Record<AnnouncementType, string> = {
  maintenance: "Maintenance",
  feature: "Feature",
  alert: "Alert",
  info: "Info",
}

export const announcementTargetAudienceLabels: Record<
  AnnouncementTargetAudience,
  string
> = {
  all: "All tenants",
  plan_specific: "Plan specific",
  admins_only: "Admins only",
}
