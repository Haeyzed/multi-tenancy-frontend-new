import type { Category, CategoryFormPayload } from "@/types/tenant/category"

export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getDefaultCategoryFormValues(): CategoryFormPayload {
  return {
    parent_id: null,
    name: "",
    slug: "",
    description: "",
    banner_media_id: null,
    icon_media_id: null,
    sort_order: 0,
    is_active: true,
    is_featured: false,
    show_in_menu: true,
  }
}

export function categoryToFormPayload(category: Category): CategoryFormPayload {
  return {
    parent_id: category.parent_id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    banner_media_id: category.banner_media_id,
    icon_media_id: category.icon_media_id,
    sort_order: category.sort_order,
    is_active: category.is_active,
    is_featured: category.is_featured,
    show_in_menu: category.show_in_menu,
  }
}

export interface CategoryFormState {
  parentId: string
  name: string
  slug: string
  description: string
  bannerMediaId: number | null
  bannerPreviewUrl: string | null
  bannerPreviewTitle: string | null
  iconMediaId: number | null
  iconPreviewUrl: string | null
  iconPreviewTitle: string | null
  sortOrder: string
  isActive: boolean
  isFeatured: boolean
  showInMenu: boolean
}

export function formStateFromCategory(category: Category | null): CategoryFormState {
  if (!category) {
    const defaults = getDefaultCategoryFormValues()

    return {
      parentId: defaults.parent_id ?? "",
      name: defaults.name,
      slug: defaults.slug,
      description: defaults.description ?? "",
      bannerMediaId: defaults.banner_media_id ?? null,
      bannerPreviewUrl: null,
      bannerPreviewTitle: null,
      iconMediaId: defaults.icon_media_id ?? null,
      iconPreviewUrl: null,
      iconPreviewTitle: null,
      sortOrder: String(defaults.sort_order ?? 0),
      isActive: defaults.is_active ?? true,
      isFeatured: defaults.is_featured ?? false,
      showInMenu: defaults.show_in_menu ?? true,
    }
  }

  const payload = categoryToFormPayload(category)

  return {
    parentId: payload.parent_id ?? "",
    name: payload.name,
    slug: payload.slug,
    description: payload.description ?? "",
    bannerMediaId: payload.banner_media_id ?? null,
    bannerPreviewUrl: category.banner_media?.url ?? null,
    bannerPreviewTitle: category.banner_media?.file_name ?? category.name,
    iconMediaId: payload.icon_media_id ?? null,
    iconPreviewUrl: category.icon_media?.url ?? null,
    iconPreviewTitle: category.icon_media?.file_name ?? category.name,
    sortOrder: String(payload.sort_order ?? 0),
    isActive: payload.is_active ?? true,
    isFeatured: payload.is_featured ?? false,
    showInMenu: payload.show_in_menu ?? true,
  }
}

export function formStateToPayload(state: CategoryFormState): CategoryFormPayload {
  return {
    parent_id: state.parentId || null,
    name: state.name.trim(),
    slug: state.slug.trim(),
    description: state.description.trim() || null,
    banner_media_id: state.bannerMediaId,
    icon_media_id: state.iconMediaId,
    sort_order: Number.parseInt(state.sortOrder, 10) || 0,
    is_active: state.isActive,
    is_featured: state.isFeatured,
    show_in_menu: state.showInMenu,
  }
}
