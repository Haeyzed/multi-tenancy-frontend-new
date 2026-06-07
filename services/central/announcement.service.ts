import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  AnnouncementFormPayload,
  AnnouncementListParams,
  PlatformAnnouncement,
} from "@/types/central/announcement"

export const announcementService = {
  getPaginated(params: AnnouncementListParams = {}) {
    return apiPaginatedRequest<PlatformAnnouncement[]>("announcements", {
      query: params,
    })
  },

  get(id: number) {
    return apiClient.get<PlatformAnnouncement>(`announcements/${id}`)
  },

  create(payload: AnnouncementFormPayload) {
    return apiClient.post<PlatformAnnouncement>("announcements", payload)
  },

  update(id: number, payload: Partial<AnnouncementFormPayload>) {
    return apiClient.put<PlatformAnnouncement>(`announcements/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.delete<void>(`announcements/${id}`)
  },

  bulkDelete(ids: number[]) {
    return apiClient.bulkDelete<{ deleted: number }>("announcements/bulk", ids)
  },
}
