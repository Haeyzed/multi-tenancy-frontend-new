import type { Brand, BrandFormPayload } from "@/types/tenant/brand"

export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getDefaultBrandFormValues(): BrandFormPayload {
  return {
    name: "",
    slug: "",
    description: "",
    logo_media_id: null,
    website_url: "",
    is_active: true,
    sort_order: 0,
  }
}

export function brandToFormPayload(brand: Brand): BrandFormPayload {
  return {
    name: brand.name,
    slug: brand.slug,
    description: brand.description ?? "",
    logo_media_id: brand.logo_media_id,
    website_url: brand.website_url ?? "",
    is_active: brand.is_active,
    sort_order: brand.sort_order,
  }
}

export interface BrandFormState {
  name: string
  slug: string
  description: string
  logoMediaId: number | null
  logoPreviewUrl: string | null
  logoPreviewTitle: string | null
  websiteUrl: string
  isActive: boolean
  sortOrder: string
}

export function formStateFromBrand(brand: Brand | null): BrandFormState {
  if (!brand) {
    const defaults = getDefaultBrandFormValues()

    return {
      name: defaults.name,
      slug: defaults.slug,
      description: defaults.description ?? "",
      logoMediaId: defaults.logo_media_id ?? null,
      logoPreviewUrl: null,
      logoPreviewTitle: null,
      websiteUrl: defaults.website_url ?? "",
      isActive: defaults.is_active ?? true,
      sortOrder: String(defaults.sort_order ?? 0),
    }
  }

  const payload = brandToFormPayload(brand)

  return {
    name: payload.name,
    slug: payload.slug,
    description: payload.description ?? "",
    logoMediaId: payload.logo_media_id ?? null,
    logoPreviewUrl: brand.logo_media?.url ?? null,
    logoPreviewTitle: brand.logo_media?.file_name ?? brand.name,
    websiteUrl: payload.website_url ?? "",
    isActive: payload.is_active ?? true,
    sortOrder: String(payload.sort_order ?? 0),
  }
}

export function formStateToPayload(state: BrandFormState): BrandFormPayload {
  return {
    name: state.name.trim(),
    slug: state.slug.trim(),
    description: state.description.trim() || null,
    logo_media_id: state.logoMediaId,
    website_url: state.websiteUrl.trim() || null,
    is_active: state.isActive,
    sort_order: Number.parseInt(state.sortOrder, 10) || 0,
  }
}
