import { tenantApiClient, tenantApiPaginatedRequest } from "@/lib/tenant/api/client"
import type {
  MediaBulkActionResponse,
  MediaBulkUploadResponse,
  MediaItem,
  MediaListParams,
  MediaMetricsResponse,
} from "@/types/tenant/media"

export const mediaService = {
  getPaginated(params: MediaListParams = {}) {
    const query: Record<string, string | number | boolean> = {}

    if (params.page) query.page = params.page
    if (params.per_page) query.per_page = params.per_page
    if (params.search) query.search = params.search
    if (params.folder_id != null) query.folder_id = params.folder_id
    if (params.mime_type) query.mime_type = params.mime_type
    if (params.root_only) query.root_only = true

    return tenantApiPaginatedRequest<MediaItem[]>("media", { query })
  },

  get(id: number) {
    return tenantApiClient.get<MediaItem>(`media/${id}`)
  },

  getMetrics() {
    return tenantApiClient.get<MediaMetricsResponse>("media/metrics/cards")
  },

  upload(file: File, meta: { folder_id?: number | null; title?: string; alt_text?: string } = {}) {
    const formData = new FormData()
    formData.append("file", file)

    if (meta.folder_id != null) {
      formData.append("folder_id", String(meta.folder_id))
    }

    if (meta.title) {
      formData.append("title", meta.title)
    }

    if (meta.alt_text) {
      formData.append("alt_text", meta.alt_text)
    }

    return tenantApiClient.uploadWithMessage<MediaItem>("media", formData)
  },

  bulkUpload(
    files: File[],
    meta: { folder_id?: number | null; title?: string; alt_text?: string } = {},
  ) {
    const formData = new FormData()

    for (const file of files) {
      formData.append("files[]", file)
    }

    if (meta.folder_id != null) {
      formData.append("folder_id", String(meta.folder_id))
    }

    if (meta.title) {
      formData.append("title", meta.title)
    }

    if (meta.alt_text) {
      formData.append("alt_text", meta.alt_text)
    }

    return tenantApiClient.uploadWithMessage<MediaBulkUploadResponse>(
      "media/bulk-upload",
      formData,
    )
  },

  update(
    id: number,
    payload: { title?: string; alt_text?: string | null; folder_id?: number | null },
  ) {
    return tenantApiClient.putWithMessage<MediaItem>(`media/${id}`, payload)
  },

  move(ids: number[], folderId: number | null) {
    return tenantApiClient.postWithMessage<MediaBulkActionResponse>("media/move", {
      ids,
      folder_id: folderId,
    })
  },

  copy(ids: number[], folderId: number | null) {
    return tenantApiClient.postWithMessage<MediaBulkActionResponse>("media/copy", {
      ids,
      folder_id: folderId,
    })
  },

  bulkUpdate(
    ids: number[],
    payload: { title?: string; alt_text?: string | null },
  ) {
    return tenantApiClient.patchWithMessage<MediaBulkActionResponse>("media/bulk", {
      ids,
      ...payload,
    })
  },

  delete(id: number) {
    return tenantApiClient.deleteWithMessage<void>(`media/${id}`)
  },

  bulkDelete(ids: number[]) {
    return tenantApiClient.bulkDeleteWithMessage<{ deleted: number }>("media/bulk", ids)
  },
}
