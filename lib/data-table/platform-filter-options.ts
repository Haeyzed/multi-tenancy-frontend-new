import {
  AlertTriangleIcon,
  BugIcon,
  GlobeIcon,
  ShieldIcon,
  SparklesIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react"

import {
  ChangelogTypes,
  changelogTypeLabels,
} from "@/types/central/changelog"

export const changelogPublishedFilterOptions = [
  { label: "Published", value: "published", icon: GlobeIcon },
  { label: "Draft", value: "draft", icon: BugIcon },
] as const

export const changelogTypeFilterOptions = [
  {
    label: changelogTypeLabels[ChangelogTypes.Feature],
    value: ChangelogTypes.Feature,
    icon: SparklesIcon,
  },
  {
    label: changelogTypeLabels[ChangelogTypes.Fix],
    value: ChangelogTypes.Fix,
    icon: WrenchIcon,
  },
  {
    label: changelogTypeLabels[ChangelogTypes.Breaking],
    value: ChangelogTypes.Breaking,
    icon: AlertTriangleIcon,
  },
  {
    label: changelogTypeLabels[ChangelogTypes.Security],
    value: ChangelogTypes.Security,
    icon: ShieldIcon,
  },
  {
    label: changelogTypeLabels[ChangelogTypes.Performance],
    value: ChangelogTypes.Performance,
    icon: ZapIcon,
  },
] as const

export const changelogTypeOptions = changelogTypeFilterOptions.map(({ label, value }) => ({
  label,
  value,
}))

export const activityEventFilterOptions = [
  { label: "Created", value: "created", icon: SparklesIcon },
  { label: "Updated", value: "updated", icon: WrenchIcon },
  { label: "Deleted", value: "deleted", icon: AlertTriangleIcon },
] as const
