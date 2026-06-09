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
    return apiClient.postWithMessage<Plan>("plans", payload)
  },

  update(id: string, payload: Partial<PlanFormPayload>) {
    return apiClient.putWithMessage<Plan>(`plans/${id}`, payload)
  },

  delete(id: string) {
    return apiClient.deleteWithMessage<void>(`plans/${id}`)
  },

  bulkDelete(ids: string[]) {
    return apiClient.bulkDeleteWithMessage<{ deleted: number }>("plans/bulk", ids)
  },
}
