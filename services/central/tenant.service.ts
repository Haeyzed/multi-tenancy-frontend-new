import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type { SelectOption } from "@/types/central/api"
import type { MetricCard, Tenant, TenantListParams } from "@/types/central/tenant"

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

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("tenants/metrics/cards", {
      tenantScoped: true,
    })
  },

  delete(id: string) {
    return apiClient.delete<void>(`tenants/${id}`)
  },
}
