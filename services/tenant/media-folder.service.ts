import { tenantApiClient } from "@/lib/tenant/api/client"
import type { MediaFolder, MediaFolderFormPayload, MediaFolderTreeNode } from "@/types/tenant/media"

export const mediaFolderService = {
  getTree() {
    return tenantApiClient.get<{ tree: MediaFolderTreeNode[] }>("media-folders/tree")
  },

  getAll(search?: string) {
    return tenantApiClient.get<MediaFolder[]>("media-folders", {
      query: search ? { search } : undefined,
    })
  },

  create(payload: MediaFolderFormPayload) {
    return tenantApiClient.postWithMessage<MediaFolder>("media-folders", payload)
  },

  update(id: number, payload: Partial<MediaFolderFormPayload>) {
    return tenantApiClient.putWithMessage<MediaFolder>(`media-folders/${id}`, payload)
  },

  delete(id: number) {
    return tenantApiClient.deleteWithMessage<void>(`media-folders/${id}`)
  },

  bulkDelete(ids: number[]) {
    return tenantApiClient.bulkDeleteWithMessage<{ deleted: number }>(
      "media-folders/bulk",
      ids,
    )
  },
}
