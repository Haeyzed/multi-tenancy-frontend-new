import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type { MetricCard } from "@/types/central/tenant"
import type { HealthCheck, HealthCheckListParams } from "@/types/central/health-check"

export const healthCheckService = {
  getPaginated(params: HealthCheckListParams = {}) {
    return apiPaginatedRequest<HealthCheck[]>("health-checks", {
      query: params,
      tenantScoped: true,
    })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>(
      "health-checks/metrics/cards",
      { tenantScoped: true },
    )
  },

  get(id: number) {
    return apiClient.get<HealthCheck>(`health-checks/${id}`, {
      tenantScoped: true,
    })
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`health-checks/${id}`)
  },
}
