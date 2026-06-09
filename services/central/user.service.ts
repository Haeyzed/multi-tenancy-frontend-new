import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  MetricCard,
  User,
  UserFormPayload,
  UserListParams,
} from "@/types/central/user"

export const userService = {
  getPaginated(params: UserListParams = {}) {
    return apiPaginatedRequest<User[]>("users", { query: params })
  },

  get(id: number) {
    return apiClient.get<User>(`users/${id}`)
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("users/metrics/cards")
  },

  create(payload: UserFormPayload) {
    return apiClient.postWithMessage<User>("users", payload)
  },

  update(id: number, payload: Partial<UserFormPayload>) {
    return apiClient.putWithMessage<User>(`users/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`users/${id}`)
  },

  bulkDelete(ids: number[]) {
    return apiClient.bulkDeleteWithMessage<{ deleted: number }>("users/bulk", ids)
  },

  syncRoles(id: number, roleIds: number[]) {
    return apiClient.put<User>(`users/${id}/roles`, {
      role_ids: roleIds,
    })
  },

  syncPermissions(id: number, permissionIds: number[]) {
    return apiClient.put<User>(`users/${id}/permissions`, {
      permission_ids: permissionIds,
    })
  },

  detachRole(userId: number, roleId: number) {
    return apiClient.delete<User>(`users/${userId}/roles/${roleId}`)
  },

  detachPermission(userId: number, permissionId: number) {
    return apiClient.delete<User>(`users/${userId}/permissions/${permissionId}`)
  },
}
