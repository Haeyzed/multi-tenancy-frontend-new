import { AlertCircle, BanIcon, CheckCircleIcon } from "lucide-react"

export const impersonationTokenStatusFilterOptions = [
  { label: "Valid", value: "valid", icon: CheckCircleIcon },
  { label: "Used", value: "used", icon: BanIcon },
  { label: "Expired", value: "expired", icon: AlertCircle },
] as const
