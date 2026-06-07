import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type { SelectOption } from "@/types/central/api"
import type {
  MetricCard,
  Plan,
  PlanFormPayload,
  PlanListParams,
} from "@/types/central/plan"

export const planService = {
  getPaginated(params: PlanListParams = {}) {
    return apiPaginatedRequest<Plan[]>("plans", { query: params })
  },

  getOptions() {
    return apiClient.get<SelectOption[]>("plans/options/list")
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("plans/metrics/cards")
  },

  create(payload: PlanFormPayload) {
    return apiClient.post<Plan>("plans", payload)
  },

  update(id: string, payload: Partial<PlanFormPayload>) {
    return apiClient.put<Plan>(`plans/${id}`, payload)
  },

  delete(id: string) {
    return apiClient.delete<void>(`plans/${id}`)
  },

  bulkDelete(ids: string[]) {
    return apiClient.bulkDelete<{ deleted: number }>("plans/bulk", ids)
  },
}
