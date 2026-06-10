import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  MetricCard,
  TenantMetric,
  TenantMetricFormPayload,
  TenantMetricListParams,
} from "@/types/central/tenant-metric"

export const tenantMetricService = {
  getPaginated(params: TenantMetricListParams = {}) {
    return apiPaginatedRequest<TenantMetric[]>("metrics", {
      query: params,
      tenantScoped: true,
    })
  },

  getMetrics(params?: { start_date?: string; end_date?: string }) {
    return apiClient.get<{ cards: MetricCard[] }>("metrics/cards", {
      query: params,
      tenantScoped: true,
    })
  },

  get(id: number) {
    return apiClient.get<TenantMetric>(`metrics/${id}`, { tenantScoped: true })
  },

  create(payload: TenantMetricFormPayload) {
    return apiClient.postWithMessage<TenantMetric>("metrics", payload)
  },

  update(id: number, payload: Partial<TenantMetricFormPayload>) {
    return apiClient.putWithMessage<TenantMetric>(`metrics/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`metrics/${id}`)
  },
}
