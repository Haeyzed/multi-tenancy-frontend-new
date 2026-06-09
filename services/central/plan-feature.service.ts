import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  PlanFeature,
  PlanFeatureFormPayload,
  PlanFeatureListParams,
} from "@/types/central/plan-feature"

export const planFeatureService = {
  getPaginated(params: PlanFeatureListParams = {}) {
    return apiPaginatedRequest<PlanFeature[]>("plan-features", { query: params })
  },

  getByPlan(planId: string) {
    return apiPaginatedRequest<PlanFeature[]>("plan-features", {
      query: { plan_id: planId, per_page: 100 },
    })
  },

  create(payload: PlanFeatureFormPayload) {
    return apiClient.postWithMessage<PlanFeature>("plan-features", payload)
  },

  update(id: number, payload: Partial<PlanFeatureFormPayload>) {
    return apiClient.putWithMessage<PlanFeature>(`plan-features/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`plan-features/${id}`)
  },
}
