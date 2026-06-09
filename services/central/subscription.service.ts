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
    return apiClient.deleteWithMessage<void>(`subscriptions/${id}`)
  },

  bulkDelete(ids: string[]) {
    return apiClient.bulkDeleteWithMessage<{ deleted: number }>(
      "subscriptions/bulk",
      ids,
    )
  },

  get(id: string) {
    return apiClient.get<Subscription>(`subscriptions/${id}`, {
      tenantScoped: true,
    })
  },

  cancel(id: string, reason?: string) {
    return apiClient.postWithMessage<Subscription>(`subscriptions/${id}/cancel`, {
      reason,
    })
  },

  renew(id: string) {
    return apiClient.postWithMessage<Subscription>(`subscriptions/${id}/renew`)
  },

  reactivate(id: string) {
    return apiClient.postWithMessage<Subscription>(
      `subscriptions/${id}/reactivate`,
    )
  },

  upgrade(id: string, planId: string) {
    return apiClient.postWithMessage<Subscription>(`subscriptions/${id}/upgrade`, {
      plan_id: planId,
    })
  },

  downgrade(id: string, planId: string) {
    return apiClient.postWithMessage<Subscription>(
      `subscriptions/${id}/downgrade`,
      { plan_id: planId },
    )
  },
}
