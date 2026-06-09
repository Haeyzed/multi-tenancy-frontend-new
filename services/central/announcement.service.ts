import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  AnnouncementFormPayload,
  AnnouncementListParams,
  MetricCard,
  PlatformAnnouncement,
} from "@/types/central/announcement"

export const announcementService = {
  getPaginated(params: AnnouncementListParams = {}) {
    return apiPaginatedRequest<PlatformAnnouncement[]>("announcements", {
      query: params,
    })
  },

  getMetrics() {
    return apiClient.get<{ cards: MetricCard[] }>("announcements/metrics/cards")
  },

  get(id: number) {
    return apiClient.get<PlatformAnnouncement>(`announcements/${id}`)
  },

  create(payload: AnnouncementFormPayload) {
    return apiClient.postWithMessage<PlatformAnnouncement>("announcements", payload)
  },

  update(id: number, payload: Partial<AnnouncementFormPayload>) {
    return apiClient.putWithMessage<PlatformAnnouncement>(
      `announcements/${id}`,
      payload,
    )
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`announcements/${id}`)
  },

  bulkDelete(ids: number[]) {
    return apiClient.bulkDeleteWithMessage<{ deleted: number }>(
      "announcements/bulk",
      ids,
    )
  },
}
