import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  MetricCard,
  Role,
  RoleFormPayload,
  RoleListParams,
  RolePermissionsMatrix,
  RolePermissionsMatrixSyncPayload,
} from "@/types/central/role"

export const roleService = {
  getPaginated(params: RoleListParams = {}) {
    return apiPaginatedRequest<Role[]>("roles", { query: params })
  },

  get(id: number) {
    return apiClient.get<Role>(`roles/${id}`)
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("roles/metrics/cards")
  },

  getPermissionsMatrix(guard?: string) {
    return apiClient.get<RolePermissionsMatrix>("roles/permissions/matrix", {
      query: guard ? { guard } : undefined,
    })
  },

  syncPermissionsMatrix(payload: RolePermissionsMatrixSyncPayload) {
    return apiClient.put<RolePermissionsMatrix>(
      "roles/permissions/matrix",
      payload,
    )
  },

  create(payload: RoleFormPayload) {
    return apiClient.post<Role>("roles", payload)
  },

  update(id: number, payload: Partial<RoleFormPayload>) {
    return apiClient.put<Role>(`roles/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.delete<void>(`roles/${id}`)
  },

  syncPermissions(id: number, permissionIds: number[]) {
    return apiClient.put<Role>(`roles/${id}/permissions`, {
      permission_ids: permissionIds,
    })
  },

  attachPermissions(id: number, permissionIds: number[]) {
    return apiClient.post<Role>(`roles/${id}/permissions`, {
      permission_ids: permissionIds,
    })
  },

  detachPermission(roleId: number, permissionId: number) {
    return apiClient.delete<Role>(`roles/${roleId}/permissions/${permissionId}`)
  },
}
