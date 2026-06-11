import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  PaymentMethod,
  PaymentMethodListParams,
} from "@/types/central/payment-method"

export const paymentMethodService = {
  getPaginated(params: PaymentMethodListParams = {}) {
    return apiPaginatedRequest<PaymentMethod[]>("payment-methods", {
      query: params,
      tenantScoped: true,
    })
  },

  get(id: number) {
    return apiClient.get<PaymentMethod>(`payment-methods/${id}`, {
      tenantScoped: true,
    })
  },
}
