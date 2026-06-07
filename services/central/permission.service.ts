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
    return apiClient.post<Permission>("permissions", payload)
  },

  update(id: number, payload: Partial<PermissionFormPayload>) {
    return apiClient.put<Permission>(`permissions/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.delete<void>(`permissions/${id}`)
  },
}
