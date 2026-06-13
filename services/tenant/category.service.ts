import {
  tenantApiClient,
  tenantApiPaginatedRequest,
} from "@/lib/tenant/api/client"
import type {
  Category,
  CategoryBulkDeleteResponse,
  CategoryBulkRestoreResponse,
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

  get(id: number) {
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

  update(id: number, payload: Partial<CategoryFormPayload>) {
    return tenantApiClient.putWithMessage<Category>(`categories/${id}`, payload)
  },

  delete(id: number) {
    return tenantApiClient.deleteWithMessage<void>(`categories/${id}`)
  },

  bulkDelete(ids: number[]) {
    return tenantApiClient.bulkDeleteWithMessage<CategoryBulkDeleteResponse>(
      "categories/bulk",
      ids,
    )
  },

  restore(id: number) {
    return tenantApiClient.postWithMessage<Category>(`categories/${id}/restore`)
  },

  bulkRestore(ids: number[]) {
    return tenantApiClient.postWithMessage<CategoryBulkRestoreResponse>(
      "categories/bulk/restore",
      { ids },
    )
  },

  unlink(id: number) {
    return tenantApiClient.postWithMessage<CategoryUnlinkResponse>(
      `categories/${id}/unlink`,
    )
  },

  bulkUnlink(ids: number[]) {
    return tenantApiClient.postWithMessage<CategoryUnlinkResponse>(
      "categories/bulk/unlink",
      { ids },
    )
  },
}
