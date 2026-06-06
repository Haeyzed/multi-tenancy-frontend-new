import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  MetricCard,
  Subscription,
  SubscriptionListParams,
} from "@/types/central/subscription"

export const subscriptionService = {
  getPaginated(params: SubscriptionListParams = {}) {
    return apiPaginatedRequest<Subscription[]>("subscriptions", {
      query: params,
      tenantScoped: true,
    })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("subscriptions/metrics/cards", {
      tenantScoped: true,
    })
  },

  delete(id: string) {
    return apiClient.delete<void>(`subscriptions/${id}`)
  },
}
