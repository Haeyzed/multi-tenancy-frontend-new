export interface MediaFolder {
  id: number
  name: string
  parent_id: number | null
  path: string
  media_count?: number
  created_at: string | null
  updated_at: string | null
  children?: MediaFolder[]
}

export interface MediaFolderTreeNode {
  id: number
  name: string
  path: string
  parent_id: number | null
  media_count: number
  children: MediaFolderTreeNode[]
}

export interface MediaUploader {
  id: string
  email: string
  first_name: string
  last_name: string
}

export interface MediaItem {
  id: number
  folder_id: number | null
  name: string
  title: string | null
  alt_text: string | null
  file_name: string
  mime_type: string | null
  disk: string
  size: number
  url: string
  uploaded_by: string | null
  created_at: string | null
  updated_at: string | null
  folder?: MediaFolder | null
  uploader?: MediaUploader | null
}

export interface MediaListParams {
  page?: number
  per_page?: number
  search?: string
  folder_id?: number | null
  mime_type?: string
  root_only?: boolean
}

export interface MediaMetricsResponse {
  cards: Array<{
    key: string
    label: string
    value: number | string
  }>
}

export interface MediaBulkUploadResponse {
  uploaded: number
  items: MediaItem[]
}

export interface MediaBulkActionResponse {
  moved?: number
  copied?: number
  updated?: number
  deleted?: number
  items: MediaItem[]
}

export interface MediaFolderFormPayload {
  name: string
  parent_id?: number | null
}
