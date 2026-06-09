import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  MetricCard,
  Payment,
  PaymentListParams,
} from "@/types/central/payment"

export const paymentService = {
  getPaginated(params: PaymentListParams = {}) {
    return apiPaginatedRequest<Payment[]>("payments", {
      query: params,
      tenantScoped: true,
    })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("payments/metrics/cards", {
      tenantScoped: true,
    })
  },

  get(id: string) {
    return apiClient.get<Payment>(`payments/${id}`, { tenantScoped: true })
  },

  refund(id: string, amount?: number) {
    return apiClient.postWithMessage<Payment>(`payments/${id}/refund`, {
      amount,
    })
  },
}
