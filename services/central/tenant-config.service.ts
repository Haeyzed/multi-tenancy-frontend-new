import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  TenantConfig,
  TenantConfigFormPayload,
  TenantConfigListParams,
} from "@/types/central/tenant-config"

export const tenantConfigService = {
  getPaginated(params: TenantConfigListParams = {}) {
    return apiPaginatedRequest<TenantConfig[]>("tenant-configs", {
      query: params,
      tenantScoped: true,
    })
  },

  get(id: number) {
    return apiClient.get<TenantConfig>(`tenant-configs/${id}`, {
      tenantScoped: true,
    })
  },

  create(payload: TenantConfigFormPayload) {
    return apiClient.postWithMessage<TenantConfig>("tenant-configs", payload)
  },

  update(id: number, payload: Partial<TenantConfigFormPayload>) {
    return apiClient.putWithMessage<TenantConfig>(`tenant-configs/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`tenant-configs/${id}`)
  },
}
