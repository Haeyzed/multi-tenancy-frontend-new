import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  MetricCard,
  SupportTicket,
  SupportTicketFormPayload,
  SupportTicketListParams,
} from "@/types/central/support-ticket"

export const supportTicketService = {
  getPaginated(params: SupportTicketListParams = {}) {
    return apiPaginatedRequest<SupportTicket[]>("support-tickets", {
      query: params,
      tenantScoped: true,
    })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>(
      "support-tickets/metrics/cards",
      { tenantScoped: true },
    )
  },

  get(id: number) {
    return apiClient.get<SupportTicket>(`support-tickets/${id}`, {
      tenantScoped: true,
    })
  },

  create(payload: SupportTicketFormPayload) {
    return apiClient.postWithMessage<SupportTicket>("support-tickets", payload)
  },

  update(id: number, payload: Partial<SupportTicketFormPayload>) {
    return apiClient.putWithMessage<SupportTicket>(
      `support-tickets/${id}`,
      payload,
    )
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`support-tickets/${id}`)
  },

  assign(id: number, adminId: number) {
    return apiClient.postWithMessage<SupportTicket>(
      `support-tickets/${id}/assign`,
      { admin_id: adminId },
    )
  },

  resolve(id: number) {
    return apiClient.postWithMessage<SupportTicket>(
      `support-tickets/${id}/resolve`,
    )
  },
}
