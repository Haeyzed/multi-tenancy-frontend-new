import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  MetricCard,
  Permission,
  PermissionFormPayload,
  PermissionListParams,
} from "@/types/central/permission"

export const permissionService = {
  getPaginated(params: PermissionListParams = {}) {
    return apiPaginatedRequest<Permission[]>("permissions", { query: params })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("permissions/metrics/cards")
  },

  create(payload: PermissionFormPayload) {
    return apiClient.postWithMessage<Permission>("permissions", payload)
  },

  update(id: number, payload: Partial<PermissionFormPayload>) {
    return apiClient.putWithMessage<Permission>(`permissions/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`permissions/${id}`)
  },

  bulkDelete(ids: number[]) {
    return apiClient.bulkDeleteWithMessage<{ deleted: number }>(
      "permissions/bulk",
      ids,
    )
  },
}
