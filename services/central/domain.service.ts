import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type { Domain, DomainFormPayload, DomainListParams } from "@/types/central/domain"

export const domainService = {
  getPaginated(params: DomainListParams = {}) {
    return apiPaginatedRequest<Domain[]>("domains", {
      query: params,
      tenantScoped: true,
    })
  },

  get(id: number) {
    return apiClient.get<Domain>(`domains/${id}`, { tenantScoped: true })
  },

  create(payload: DomainFormPayload) {
    return apiClient.postWithMessage<Domain>("domains", payload)
  },

  update(id: number, payload: Partial<DomainFormPayload>) {
    return apiClient.putWithMessage<Domain>(`domains/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`domains/${id}`)
  },

  setPrimary(id: number) {
    return apiClient.postWithMessage<Domain>(`domains/${id}/primary`)
  },

  verify(id: number) {
    return apiClient.postWithMessage<Domain>(`domains/${id}/verify`)
  },
}
