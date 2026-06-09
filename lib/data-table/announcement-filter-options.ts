import {
  AlertTriangle,
  Info,
  Megaphone,
  Shield,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react"

import {
  AnnouncementTargetAudiences,
  AnnouncementTypes,
  announcementTargetAudienceLabels,
  announcementTypeLabels,
} from "@/types/central/announcement"

export const announcementTypeFilterOptions = [
  {
    label: announcementTypeLabels[AnnouncementTypes.Maintenance],
    value: AnnouncementTypes.Maintenance,
    icon: Wrench,
  },
  {
    label: announcementTypeLabels[AnnouncementTypes.Feature],
    value: AnnouncementTypes.Feature,
    icon: Sparkles,
  },
  {
    label: announcementTypeLabels[AnnouncementTypes.Alert],
    value: AnnouncementTypes.Alert,
    icon: AlertTriangle,
  },
  {
    label: announcementTypeLabels[AnnouncementTypes.Info],
    value: AnnouncementTypes.Info,
    icon: Info,
  },
] as const

export const announcementAudienceFilterOptions = [
  {
    label: announcementTargetAudienceLabels[AnnouncementTargetAudiences.All],
    value: AnnouncementTargetAudiences.All,
    icon: Users,
  },
  {
    label:
      announcementTargetAudienceLabels[AnnouncementTargetAudiences.PlanSpecific],
    value: AnnouncementTargetAudiences.PlanSpecific,
    icon: Megaphone,
  },
  {
    label:
      announcementTargetAudienceLabels[AnnouncementTargetAudiences.AdminsOnly],
    value: AnnouncementTargetAudiences.AdminsOnly,
    icon: Shield,
  },
] as const
