import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  ChangelogFormPayload,
  ChangelogListParams,
  PlatformChangelog,
} from "@/types/central/changelog"

export const changelogService = {
  getPaginated(params: ChangelogListParams = {}) {
    return apiPaginatedRequest<PlatformChangelog[]>("changelog", {
      query: params,
    })
  },

  get(id: number) {
    return apiClient.get<PlatformChangelog>(`changelog/${id}`)
  },

  create(payload: ChangelogFormPayload) {
    return apiClient.postWithMessage<PlatformChangelog>("changelog", payload)
  },

  update(id: number, payload: Partial<ChangelogFormPayload>) {
    return apiClient.putWithMessage<PlatformChangelog>(`changelog/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`changelog/${id}`)
  },
}
