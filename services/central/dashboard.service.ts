import { apiClient } from "@/lib/central/api/client"
import type {
  DashboardDateRangeParams,
  DashboardOverview,
} from "@/types/central/dashboard"

export const dashboardService = {
  getOverview(params?: DashboardDateRangeParams) {
    return apiClient.get<DashboardOverview>("dashboard", { query: params })
  },
}
