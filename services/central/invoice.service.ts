import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  Invoice,
  InvoiceListParams,
  MetricCard,
} from "@/types/central/invoice"

export const invoiceService = {
  getPaginated(params: InvoiceListParams = {}) {
    return apiPaginatedRequest<Invoice[]>("invoices", {
      query: params,
      tenantScoped: true,
    })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("invoices/metrics/cards", {
      tenantScoped: true,
    })
  },

  getOverdue() {
    return apiClient.get<Invoice[]>("invoices/overdue/list", {
      tenantScoped: true,
    })
  },

  get(id: string) {
    return apiClient.get<Invoice>(`invoices/${id}`, { tenantScoped: true })
  },

  markAsPaid(id: string, paymentIntentId?: string) {
    return apiClient.postWithMessage<Invoice>(`invoices/${id}/paid`, {
      payment_intent_id: paymentIntentId,
    })
  },

  void(id: string) {
    return apiClient.putWithMessage<Invoice>(`invoices/${id}`, {
      status: "void",
    })
  },
}
