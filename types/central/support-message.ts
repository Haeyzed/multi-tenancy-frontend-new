import type { SupportTicketAssignee } from "@/types/central/support-ticket"

export const MessageSenderTypes = {
  User: "user",
  System: "system",
  Admin: "admin",
} as const

export type MessageSenderType =
  (typeof MessageSenderTypes)[keyof typeof MessageSenderTypes]

export const messageSenderTypeLabels: Record<MessageSenderType, string> = {
  user: "Tenant",
  system: "System",
  admin: "Admin",
}

export interface SupportMessage {
  id: number
  ticket_id: number
  sender_type: MessageSenderType
  sender_id: number | null
  body: string
  is_internal: boolean
  is_read: boolean
  read_at: string | null
  created_at: string | null
  updated_at: string | null
  sender?: SupportTicketAssignee | null
}

export interface SupportMessageFormPayload {
  ticket_id: number
  sender_type: MessageSenderType
  sender_id?: number | null
  body: string
  is_internal?: boolean
}

export interface SupportMessageListParams {
  page?: number
  per_page?: number
  search?: string
  ticket_id?: number
  is_read?: string
}
