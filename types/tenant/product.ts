import type { MetricCard } from "@/types/central/tenant"
import type { Brand } from "@/types/tenant/brand"
import type { Category } from "@/types/tenant/category"

export type ProductStatus = "draft" | "active" | "archived" | "discontinued"
export type ProductVisibility = "visible" | "catalog" | "search" | "hidden"
export type ProductType = "simple" | "variable" | "digital" | "bundle" | "service"

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  barcode: string | null
  description: string | null
  short_description: string | null
  brand_id: number | null
  category_id: string | null
  type: ProductType
  status: ProductStatus
  visibility: ProductVisibility
  price: string
  compare_price: string | null
  cost_price: string | null
  requires_shipping: boolean
  is_featured: boolean
  is_gift_card: boolean
  allow_backorders: boolean
  low_stock_threshold: number
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  canonical_url: string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  brand?: Brand | null
  category?: Category | null
}

export interface ProductFormPayload {
  name: string
  slug: string
  sku: string
  barcode?: string | null
  description?: string | null
  short_description?: string | null
  brand_id?: number | null
  category_id?: string | null
  type?: ProductType
  status?: ProductStatus
  visibility?: ProductVisibility
  price: number | string
  compare_price?: number | string | null
  cost_price?: number | string | null
  requires_shipping?: boolean
  is_featured?: boolean
  is_gift_card?: boolean
  allow_backorders?: boolean
  low_stock_threshold?: number
}

export interface ProductListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
}

export interface ProductOption {
  value: string
  label: string
}

export interface ProductMetricsResponse {
  cards: MetricCard[]
}

export interface ProductBulkDeleteResponse {
  deleted: number
}
