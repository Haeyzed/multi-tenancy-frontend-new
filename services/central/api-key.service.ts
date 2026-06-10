import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  ApiKey,
  ApiKeyFormPayload,
  ApiKeyListParams,
  MetricCard,
} from "@/types/central/api-key"

export const apiKeyService = {
  getPaginated(params: ApiKeyListParams = {}) {
    return apiPaginatedRequest<ApiKey[]>("api-keys", {
      query: params,
      tenantScoped: true,
    })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("api-keys/metrics/cards", {
      tenantScoped: true,
    })
  },

  get(id: number) {
    return apiClient.get<ApiKey>(`api-keys/${id}`, { tenantScoped: true })
  },

  create(payload: ApiKeyFormPayload) {
    return apiClient.postWithMessage<ApiKey>("api-keys", payload)
  },

  update(id: number, payload: Partial<ApiKeyFormPayload>) {
    return apiClient.putWithMessage<ApiKey>(`api-keys/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`api-keys/${id}`)
  },

  revoke(id: number) {
    return apiClient.postWithMessage<ApiKey>(`api-keys/${id}/revoke`)
  },
}
