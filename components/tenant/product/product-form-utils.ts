import type {
  Product,
  ProductFormPayload,
  ProductStatus,
  ProductType,
  ProductVisibility,
} from "@/types/tenant/product"

export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const productStatusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "discontinued", label: "Discontinued" },
] as const

export const productVisibilityOptions = [
  { value: "visible", label: "Visible" },
  { value: "catalog", label: "Catalog only" },
  { value: "search", label: "Search only" },
  { value: "hidden", label: "Hidden" },
] as const

export const productTypeOptions = [
  { value: "simple", label: "Simple" },
  { value: "variable", label: "Variable" },
  { value: "digital", label: "Digital" },
  { value: "bundle", label: "Bundle" },
  { value: "service", label: "Service" },
] as const

export function getDefaultProductFormValues(): ProductFormPayload {
  return {
    name: "",
    slug: "",
    sku: "",
    description: "",
    short_description: "",
    brand_id: null,
    category_id: null,
    type: "simple",
    status: "draft",
    visibility: "visible",
    price: "0.00",
    compare_price: null,
    cost_price: null,
    requires_shipping: true,
    is_featured: false,
    is_gift_card: false,
    allow_backorders: false,
    low_stock_threshold: 10,
  }
}

export function productToFormPayload(product: Product): ProductFormPayload {
  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    barcode: product.barcode,
    description: product.description ?? "",
    short_description: product.short_description ?? "",
    brand_id: product.brand_id,
    category_id: product.category_id,
    type: product.type,
    status: product.status,
    visibility: product.visibility,
    price: product.price,
    compare_price: product.compare_price,
    cost_price: product.cost_price,
    requires_shipping: product.requires_shipping,
    is_featured: product.is_featured,
    is_gift_card: product.is_gift_card,
    allow_backorders: product.allow_backorders,
    low_stock_threshold: product.low_stock_threshold,
  }
}

export interface ProductFormState {
  name: string
  slug: string
  sku: string
  description: string
  shortDescription: string
  brandId: string
  categoryId: string
  type: ProductType
  status: ProductStatus
  visibility: ProductVisibility
  price: string
  comparePrice: string
  costPrice: string
  requiresShipping: boolean
  isFeatured: boolean
  allowBackorders: boolean
  lowStockThreshold: string
}

export function formStateFromProduct(product: Product | null): ProductFormState {
  if (!product) {
    const defaults = getDefaultProductFormValues()

    return {
      name: defaults.name,
      slug: defaults.slug,
      sku: defaults.sku,
      description: defaults.description ?? "",
      shortDescription: defaults.short_description ?? "",
      brandId: defaults.brand_id ? String(defaults.brand_id) : "",
      categoryId: defaults.category_id ?? "",
      type: defaults.type ?? "simple",
      status: defaults.status ?? "draft",
      visibility: defaults.visibility ?? "visible",
      price: String(defaults.price ?? "0.00"),
      comparePrice: defaults.compare_price ? String(defaults.compare_price) : "",
      costPrice: defaults.cost_price ? String(defaults.cost_price) : "",
      requiresShipping: defaults.requires_shipping ?? true,
      isFeatured: defaults.is_featured ?? false,
      allowBackorders: defaults.allow_backorders ?? false,
      lowStockThreshold: String(defaults.low_stock_threshold ?? 10),
    }
  }

  const payload = productToFormPayload(product)

  return {
    name: payload.name,
    slug: payload.slug,
    sku: payload.sku,
    description: payload.description ?? "",
    shortDescription: payload.short_description ?? "",
    brandId: payload.brand_id ? String(payload.brand_id) : "",
    categoryId: payload.category_id ?? "",
    type: payload.type ?? "simple",
    status: payload.status ?? "draft",
    visibility: payload.visibility ?? "visible",
    price: String(payload.price ?? "0.00"),
    comparePrice: payload.compare_price ? String(payload.compare_price) : "",
    costPrice: payload.cost_price ? String(payload.cost_price) : "",
    requiresShipping: payload.requires_shipping ?? true,
    isFeatured: payload.is_featured ?? false,
    allowBackorders: payload.allow_backorders ?? false,
    lowStockThreshold: String(payload.low_stock_threshold ?? 10),
  }
}

export function formStateToPayload(state: ProductFormState): ProductFormPayload {
  return {
    name: state.name.trim(),
    slug: state.slug.trim(),
    sku: state.sku.trim(),
    description: state.description.trim() || null,
    short_description: state.shortDescription.trim() || null,
    brand_id: state.brandId ? Number.parseInt(state.brandId, 10) : null,
    category_id: state.categoryId || null,
    type: state.type,
    status: state.status,
    visibility: state.visibility,
    price: state.price.trim() || "0",
    compare_price: state.comparePrice.trim() || null,
    cost_price: state.costPrice.trim() || null,
    requires_shipping: state.requiresShipping,
    is_featured: state.isFeatured,
    allow_backorders: state.allowBackorders,
    low_stock_threshold: Number.parseInt(state.lowStockThreshold, 10) || 0,
  }
}
