import { CheckCircle, Globe, XCircle } from "lucide-react"

export const activeInactiveFilterOptions = [
  { label: "Active", value: "active", icon: CheckCircle },
  { label: "Inactive", value: "inactive", icon: XCircle },
] as const

export const publicPrivateFilterOptions = [
  { label: "Public", value: "public", icon: Globe },
  { label: "Private", value: "private", icon: XCircle },
] as const
