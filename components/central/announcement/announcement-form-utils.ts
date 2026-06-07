import type {
  AnnouncementTargetAudience,
  AnnouncementType,
  PlatformAnnouncement,
  AnnouncementFormPayload,
} from "@/types/central/announcement"
import {
  AnnouncementTargetAudiences,
  AnnouncementTypes,
} from "@/types/central/announcement"

export interface AnnouncementFormState {
  title: string
  body: string
  type: AnnouncementType
  targetAudience: AnnouncementTargetAudience
  targetPlanSlugs: string[]
  isActive: boolean
  startsAt: string
  endsAt: string
}

const defaultFormState: AnnouncementFormState = {
  title: "",
  body: "",
  type: AnnouncementTypes.Info,
  targetAudience: AnnouncementTargetAudiences.All,
  targetPlanSlugs: [],
  isActive: true,
  startsAt: "",
  endsAt: "",
}

function isoToDatetimeLocal(value: string | null): string {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const pad = (part: number) => String(part).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function datetimeLocalToIso(value: string): string | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const date = new Date(trimmed)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

export function formStateFromAnnouncement(
  announcement: PlatformAnnouncement | null,
): AnnouncementFormState {
  if (!announcement) {
    return defaultFormState
  }

  return {
    title: announcement.title,
    body: announcement.body,
    type: announcement.type,
    targetAudience: announcement.target_audience,
    targetPlanSlugs: announcement.target_plans?.map(String) ?? [],
    isActive: announcement.is_active,
    startsAt: isoToDatetimeLocal(announcement.starts_at),
    endsAt: isoToDatetimeLocal(announcement.ends_at),
  }
}

export function formStateToPayload(
  state: AnnouncementFormState,
): AnnouncementFormPayload {
  const payload: AnnouncementFormPayload = {
    title: state.title.trim(),
    body: state.body.trim(),
    type: state.type,
    target_audience: state.targetAudience,
    is_active: state.isActive,
    starts_at: datetimeLocalToIso(state.startsAt),
    ends_at: datetimeLocalToIso(state.endsAt),
  }

  if (state.targetAudience === AnnouncementTargetAudiences.PlanSpecific) {
    payload.target_plans = state.targetPlanSlugs
  } else {
    payload.target_plans = null
  }

  return payload
}

export function formatAnnouncementSchedule(
  startsAt: string | null,
  endsAt: string | null,
): string {
  if (!startsAt && !endsAt) {
    return "Always"
  }

  const format = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })

  if (startsAt && endsAt) {
    return `${format(startsAt)} – ${format(endsAt)}`
  }

  if (startsAt) {
    return `From ${format(startsAt)}`
  }

  return `Until ${format(endsAt!)}`
}
