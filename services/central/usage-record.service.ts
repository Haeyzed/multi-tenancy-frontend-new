import { apiClient, apiPaginatedRequest } from "@/lib/central/api/client"
import type {
  UsageRecord,
  UsageRecordFormPayload,
  UsageRecordListParams,
} from "@/types/central/usage-record"

export const usageRecordService = {
  getPaginated(params: UsageRecordListParams = {}) {
    return apiPaginatedRequest<UsageRecord[]>("usage-records", {
      query: params,
      tenantScoped: true,
    })
  },

  get(id: number) {
    return apiClient.get<UsageRecord>(`usage-records/${id}`, {
      tenantScoped: true,
    })
  },

  create(payload: UsageRecordFormPayload) {
    return apiClient.postWithMessage<UsageRecord>("usage-records", payload)
  },

  update(id: number, payload: Partial<UsageRecordFormPayload>) {
    return apiClient.putWithMessage<UsageRecord>(`usage-records/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.deleteWithMessage<void>(`usage-records/${id}`)
  },
}
