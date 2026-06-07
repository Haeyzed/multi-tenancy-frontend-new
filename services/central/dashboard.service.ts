import { apiClient } from "@/lib/central/api/client"
import type { DashboardOverview } from "@/types/central/dashboard"

export const dashboardService = {
  getOverview() {
    return apiClient.get<DashboardOverview>("dashboard")
  },
}
