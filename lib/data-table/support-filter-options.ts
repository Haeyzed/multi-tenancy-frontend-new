import {
  AlertCircle,
  CheckCircle,
  CircleDot,
  Clock,
  FolderIcon,
  TagIcon,
} from "lucide-react"

import {
  SupportTicketCategories,
  SupportTicketPriorities,
  SupportTicketStatuses,
  supportTicketCategoryLabels,
  supportTicketPriorityLabels,
  supportTicketStatusLabels,
} from "@/types/central/support-ticket"

export const supportTicketStatusFilterOptions = [
  {
    label: supportTicketStatusLabels[SupportTicketStatuses.Open],
    value: SupportTicketStatuses.Open,
    icon: CircleDot,
  },
  {
    label: supportTicketStatusLabels[SupportTicketStatuses.InProgress],
    value: SupportTicketStatuses.InProgress,
    icon: Clock,
  },
  {
    label: supportTicketStatusLabels[SupportTicketStatuses.WaitingCustomer],
    value: SupportTicketStatuses.WaitingCustomer,
    icon: Clock,
  },
  {
    label: supportTicketStatusLabels[SupportTicketStatuses.Resolved],
    value: SupportTicketStatuses.Resolved,
    icon: CheckCircle,
  },
  {
    label: supportTicketStatusLabels[SupportTicketStatuses.Closed],
    value: SupportTicketStatuses.Closed,
    icon: CheckCircle,
  },
] as const

export const supportTicketPriorityFilterOptions = [
  {
    label: supportTicketPriorityLabels[SupportTicketPriorities.Urgent],
    value: SupportTicketPriorities.Urgent,
    icon: AlertCircle,
  },
  {
    label: supportTicketPriorityLabels[SupportTicketPriorities.High],
    value: SupportTicketPriorities.High,
    icon: AlertCircle,
  },
  {
    label: supportTicketPriorityLabels[SupportTicketPriorities.Medium],
    value: SupportTicketPriorities.Medium,
    icon: Clock,
  },
  {
    label: supportTicketPriorityLabels[SupportTicketPriorities.Low],
    value: SupportTicketPriorities.Low,
    icon: CircleDot,
  },
] as const

export const supportTicketCategoryFilterOptions = [
  {
    label: supportTicketCategoryLabels[SupportTicketCategories.Billing],
    value: SupportTicketCategories.Billing,
    icon: TagIcon,
  },
  {
    label: supportTicketCategoryLabels[SupportTicketCategories.Technical],
    value: SupportTicketCategories.Technical,
    icon: FolderIcon,
  },
  {
    label: supportTicketCategoryLabels[SupportTicketCategories.General],
    value: SupportTicketCategories.General,
    icon: FolderIcon,
  },
  {
    label: supportTicketCategoryLabels[SupportTicketCategories.FeatureRequest],
    value: SupportTicketCategories.FeatureRequest,
    icon: TagIcon,
  },
] as const

export const supportTicketCategoryOptions = supportTicketCategoryFilterOptions.map(
  ({ label, value }) => ({ label, value }),
)

export const supportTicketPriorityOptions = supportTicketPriorityFilterOptions.map(
  ({ label, value }) => ({ label, value }),
)

export const supportTicketStatusOptions = supportTicketStatusFilterOptions.map(
  ({ label, value }) => ({ label, value }),
)
