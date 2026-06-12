import {
  tenantApiClient,
  tenantApiPaginatedRequest,
} from "@/lib/tenant/api/client"
import type {
  Product,
  ProductBulkDeleteResponse,
  ProductFormPayload,
  ProductListParams,
  ProductMetricsResponse,
  ProductOption,
} from "@/types/tenant/product"

export const productService = {
  getPaginated(params: ProductListParams = {}) {
    return tenantApiPaginatedRequest<Product[]>("products", { query: params })
  },

  get(id: string) {
    return tenantApiClient.get<Product>(`products/${id}`)
  },

  getMetrics() {
    return tenantApiClient.get<ProductMetricsResponse>("products/metrics/cards")
  },

  getOptions() {
    return tenantApiClient.get<ProductOption[]>("products/options/list")
  },

  create(payload: ProductFormPayload) {
    return tenantApiClient.postWithMessage<Product>("products", payload)
  },

  update(id: string, payload: Partial<ProductFormPayload>) {
    return tenantApiClient.putWithMessage<Product>(`products/${id}`, payload)
  },

  delete(id: string) {
    return tenantApiClient.deleteWithMessage<void>(`products/${id}`)
  },

  bulkDelete(ids: string[]) {
    return tenantApiClient.bulkDeleteWithMessage<ProductBulkDeleteResponse>(
      "products/bulk",
      ids,
    )
  },
}
