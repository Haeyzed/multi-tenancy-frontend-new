import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  ImpersonationToken,
  ImpersonationTokenFormPayload,
  ImpersonationTokenListParams,
} from "@/types/central/impersonation-token"

export const impersonationTokenService = {
  getPaginated(params: ImpersonationTokenListParams = {}) {
    return apiPaginatedRequest<ImpersonationToken[]>("impersonation-tokens", {
      query: params,
      tenantScoped: true,
    })
  },

  get(id: number) {
    return apiClient.get<ImpersonationToken>(`impersonation-tokens/${id}`, {
      tenantScoped: true,
    })
  },

  create(payload: ImpersonationTokenFormPayload) {
    return apiClient.postWithMessage<ImpersonationToken>(
      "impersonation-tokens",
      payload,
    )
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`impersonation-tokens/${id}`)
  },

  markAsUsed(id: number) {
    return apiClient.postWithMessage<ImpersonationToken>(
      `impersonation-tokens/${id}/use`,
    )
  },
}
