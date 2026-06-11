import { apiClient } from "@/lib/central/api/client"
import type { BroadcastConfig } from "@/types/central/broadcast"

export const broadcastService = {
  getConfig() {
    return apiClient.get<BroadcastConfig>("broadcasting/config")
  },
}
