import type { MetricCard } from "@/types/central/tenant"

export interface CategoryMedia {
  id: number
  file_name: string
  mime_type: string | null
  url: string
}

export interface Category {
  id: string
  parent_id: string | null
  name: string
  slug: string
  description: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  banner_media_id: number | null
  icon_media_id: number | null
  sort_order: number
  is_active: boolean
  is_featured: boolean
  show_in_menu: boolean
  depth: number
  path: string | null
  products_count?: number
  created_at: string | null
  updated_at: string | null
  parent?: Category | null
  banner_media?: CategoryMedia | null
  icon_media?: CategoryMedia | null
}

export interface CategoryFormPayload {
  parent_id?: string | null
  name: string
  slug: string
  description?: string | null
  banner_media_id?: number | null
  icon_media_id?: number | null
  sort_order?: number
  is_active?: boolean
  is_featured?: boolean
  show_in_menu?: boolean
}

export interface CategoryListParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: string
  is_featured?: string
  show_in_menu?: string
}

export interface CategoryOption {
  value: string
  label: string
}

export interface CategoryMetricsResponse {
  cards: MetricCard[]
}

export interface CategoryBulkDeleteResponse {
  deleted: number
}

export interface CategoryUnlinkResponse {
  unlinked: number
}
