import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  ActivityListParams,
  ActivityLogEntry,
} from "@/types/central/activity-log"

export const activityLogService = {
  getPaginated(params: ActivityListParams = {}) {
    return apiPaginatedRequest<ActivityLogEntry[]>("activities", {
      query: params,
    })
  },

  get(id: number) {
    return apiClient.get<ActivityLogEntry>(`activities/${id}`)
  },
}
