import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type { SelectOption } from "@/types/central/api"
import type { TenantFeatures } from "@/types/central/tenant-features"
import type { MetricCard, Tenant, TenantFormPayload, TenantListParams } from "@/types/central/tenant"

export const tenantService = {
  getOptions() {
    return apiClient.get<SelectOption[]>("tenants/options/list")
  },

  getPaginated(params: TenantListParams = {}) {
    return apiPaginatedRequest<Tenant[]>("tenants", {
      query: params,
      tenantScoped: true,
    })
  },

  get(id: string) {
    return apiClient.get<Tenant>(`tenants/${id}`)
  },

  create(payload: TenantFormPayload) {
    return apiClient.postWithMessage<Tenant>("tenants", payload)
  },

  update(id: string, payload: Partial<TenantFormPayload>) {
    return apiClient.putWithMessage<Tenant>(`tenants/${id}`, payload)
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("tenants/metrics/cards", {
      tenantScoped: true,
    })
  },

  delete(id: string) {
    return apiClient.deleteWithMessage<void>(`tenants/${id}`)
  },

  bulkDelete(ids: string[]) {
    return apiClient.bulkDeleteWithMessage<{ deleted: number }>("tenants/bulk", ids)
  },

  getFeatures(id: string) {
    return apiClient.get<TenantFeatures>(`tenants/${id}/features`)
  },

  getExpiring(days = 30) {
    return apiClient.get<Tenant[]>(`tenants/expiring/${days}`)
  },
}
