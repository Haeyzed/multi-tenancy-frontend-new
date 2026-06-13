import type { MetricCard } from "@/types/central/tenant"

export interface BrandLogoMedia {
  id: number
  file_name: string
  mime_type: string | null
  url: string
}

export interface Brand {
  id: number
  name: string
  slug: string
  description: string | null
  logo_media_id: number | null
  website_url: string | null
  is_active: boolean
  sort_order: number
  products_count?: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  logo_media?: BrandLogoMedia | null
}

export interface BrandFormPayload {
  name: string
  slug: string
  description?: string | null
  logo_media_id?: number | null
  website_url?: string | null
  is_active?: boolean
  sort_order?: number
}

export interface BrandListParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: string
  trashed?: string
}

export interface BrandOption {
  value: number
  label: string
}

export interface BrandMetricsResponse {
  cards: MetricCard[]
}

export interface BrandBulkDeleteResponse {
  deleted: number
}

export interface BrandBulkRestoreResponse {
  restored: number
}

export interface BrandUnlinkResponse {
  unlinked: number
}
