import {
  tenantApiClient,
  tenantApiPaginatedRequest,
} from "@/lib/tenant/api/client"
import type {
  Brand,
  BrandBulkDeleteResponse,
  BrandFormPayload,
  BrandListParams,
  BrandMetricsResponse,
  BrandOption,
  BrandUnlinkResponse,
} from "@/types/tenant/brand"

export const brandService = {
  getPaginated(params: BrandListParams = {}) {
    return tenantApiPaginatedRequest<Brand[]>("brands", { query: params })
  },

  get(id: number) {
    return tenantApiClient.get<Brand>(`brands/${id}`)
  },

  getMetrics() {
    return tenantApiClient.get<BrandMetricsResponse>("brands/metrics/cards")
  },

  getOptions() {
    return tenantApiClient.get<BrandOption[]>("brands/options/list")
  },

  create(payload: BrandFormPayload) {
    return tenantApiClient.postWithMessage<Brand>("brands", payload)
  },

  update(id: number, payload: Partial<BrandFormPayload>) {
    return tenantApiClient.putWithMessage<Brand>(`brands/${id}`, payload)
  },

  delete(id: number) {
    return tenantApiClient.deleteWithMessage<void>(`brands/${id}`)
  },

  bulkDelete(ids: number[]) {
    return tenantApiClient.bulkDeleteWithMessage<BrandBulkDeleteResponse>(
      "brands/bulk",
      ids,
    )
  },

  unlink(id: number) {
    return tenantApiClient.postWithMessage<BrandUnlinkResponse>(`brands/${id}/unlink`)
  },

  bulkUnlink(ids: number[]) {
    return tenantApiClient.postWithMessage<BrandUnlinkResponse>("brands/bulk/unlink", {
      ids,
    })
  },
}
