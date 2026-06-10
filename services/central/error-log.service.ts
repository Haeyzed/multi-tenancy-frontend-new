import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type { MetricCard } from "@/types/central/tenant"
import type { ErrorLog, ErrorLogListParams } from "@/types/central/error-log"

export const errorLogService = {
  getPaginated(params: ErrorLogListParams = {}) {
    return apiPaginatedRequest<ErrorLog[]>("error-logs", {
      query: params,
      tenantScoped: true,
    })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("error-logs/metrics/cards", {
      tenantScoped: true,
    })
  },

  get(id: number) {
    return apiClient.get<ErrorLog>(`error-logs/${id}`, { tenantScoped: true })
  },

  resolve(id: number) {
    return apiClient.postWithMessage<ErrorLog>(`error-logs/${id}/resolve`)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`error-logs/${id}`)
  },
}
