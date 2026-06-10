import type { MetricCard } from "@/types/central/tenant"
import type { Tenant } from "@/types/central/tenant"
import type { SupportMessage } from "@/types/central/support-message"

export const SupportTicketStatuses = {
  Open: "open",
  InProgress: "in_progress",
  WaitingCustomer: "waiting_customer",
  Resolved: "resolved",
  Closed: "closed",
} as const

export type SupportTicketStatus =
  (typeof SupportTicketStatuses)[keyof typeof SupportTicketStatuses]

export const supportTicketStatusLabels: Record<SupportTicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_customer: "Waiting Customer",
  resolved: "Resolved",
  closed: "Closed",
}

export const SupportTicketPriorities = {
  Low: "low",
  Medium: "medium",
  High: "high",
  Urgent: "urgent",
} as const

export type SupportTicketPriority =
  (typeof SupportTicketPriorities)[keyof typeof SupportTicketPriorities]

export const supportTicketPriorityLabels: Record<SupportTicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
}

export const SupportTicketCategories = {
  Billing: "billing",
  Technical: "technical",
  General: "general",
  FeatureRequest: "feature_request",
} as const

export type SupportTicketCategory =
  (typeof SupportTicketCategories)[keyof typeof SupportTicketCategories]

export const supportTicketCategoryLabels: Record<SupportTicketCategory, string> = {
  billing: "Billing",
  technical: "Technical",
  general: "General",
  feature_request: "Feature Request",
}

export interface SupportTicketAssignee {
  id: number
  name: string
  email: string
}

export interface SupportTicket {
  id: number
  tenant_id: string
  category: SupportTicketCategory
  priority: SupportTicketPriority
  status: SupportTicketStatus
  subject: string
  body: string
  assigned_to: number | null
  resolved_at: string | null
  created_at: string | null
  updated_at: string | null
  tenant?: Tenant | null
  assignee?: SupportTicketAssignee | null
  messages?: SupportMessage[]
}

export interface SupportTicketFormPayload {
  tenant_id: string
  category: SupportTicketCategory
  priority: SupportTicketPriority
  status?: SupportTicketStatus
  subject: string
  body: string
  assigned_to?: number | null
}

export interface SupportTicketListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  priority?: string
  category?: string
}

export type { MetricCard }
