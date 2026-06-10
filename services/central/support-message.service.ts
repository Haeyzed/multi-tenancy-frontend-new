import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  SupportMessage,
  SupportMessageFormPayload,
  SupportMessageListParams,
} from "@/types/central/support-message"

export const supportMessageService = {
  getPaginated(params: SupportMessageListParams = {}) {
    return apiPaginatedRequest<SupportMessage[]>("support-messages", {
      query: params,
      tenantScoped: true,
    })
  },

  create(payload: SupportMessageFormPayload) {
    return apiClient.postWithMessage<SupportMessage>("support-messages", payload)
  },

  markAsRead(id: number) {
    return apiClient.postWithMessage<SupportMessage>(
      `support-messages/${id}/read`,
    )
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`support-messages/${id}`)
  },
}
