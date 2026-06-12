import {
  tenantApiClient,
  tenantApiPaginatedRequest,
} from "@/lib/tenant/api/client"
import type {
  Category,
  CategoryBulkDeleteResponse,
  CategoryFormPayload,
  CategoryListParams,
  CategoryMetricsResponse,
  CategoryOption,
  CategoryUnlinkResponse,
} from "@/types/tenant/category"

export const categoryService = {
  getPaginated(params: CategoryListParams = {}) {
    return tenantApiPaginatedRequest<Category[]>("categories", { query: params })
  },

  get(id: string) {
    return tenantApiClient.get<Category>(`categories/${id}`)
  },

  getMetrics() {
    return tenantApiClient.get<CategoryMetricsResponse>("categories/metrics/cards")
  },

  getOptions() {
    return tenantApiClient.get<CategoryOption[]>("categories/options/list")
  },

  create(payload: CategoryFormPayload) {
    return tenantApiClient.postWithMessage<Category>("categories", payload)
  },

  update(id: string, payload: Partial<CategoryFormPayload>) {
    return tenantApiClient.putWithMessage<Category>(`categories/${id}`, payload)
  },

  delete(id: string) {
    return tenantApiClient.deleteWithMessage<void>(`categories/${id}`)
  },

  bulkDelete(ids: string[]) {
    return tenantApiClient.bulkDeleteWithMessage<CategoryBulkDeleteResponse>(
      "categories/bulk",
      ids,
    )
  },

  unlink(id: string) {
    return tenantApiClient.postWithMessage<CategoryUnlinkResponse>(
      `categories/${id}/unlink`,
    )
  },

  bulkUnlink(ids: string[]) {
    return tenantApiClient.postWithMessage<CategoryUnlinkResponse>(
      "categories/bulk/unlink",
      { ids },
    )
  },
}
