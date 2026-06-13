export const tenantQueryKeys = {
  bootstrap: {
    all: ["tenant", "bootstrap"] as const,
    public: () => [...tenantQueryKeys.bootstrap.all, "public"] as const,
  },
  auth: {
    all: ["tenant", "auth"] as const,
    me: () => [...tenantQueryKeys.auth.all, "me"] as const,
  },
  brands: {
    all: ["tenant", "brands"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      isActive: string
      trashed: string
    }) => [...tenantQueryKeys.brands.all, "list", params] as const,
    metrics: () => [...tenantQueryKeys.brands.all, "metrics"] as const,
    options: () => [...tenantQueryKeys.brands.all, "options"] as const,
    detail: (id: number) => [...tenantQueryKeys.brands.all, "detail", id] as const,
  },
  categories: {
    all: ["tenant", "categories"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      isActive: string
      isFeatured: string
      showInMenu: string
      trashed: string
    }) => [...tenantQueryKeys.categories.all, "list", params] as const,
    metrics: () => [...tenantQueryKeys.categories.all, "metrics"] as const,
    options: () => [...tenantQueryKeys.categories.all, "options"] as const,
    detail: (id: number) => [...tenantQueryKeys.categories.all, "detail", id] as const,
  },
  products: {
    all: ["tenant", "products"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      status: string
    }) => [...tenantQueryKeys.products.all, "list", params] as const,
    metrics: () => [...tenantQueryKeys.products.all, "metrics"] as const,
    options: () => [...tenantQueryKeys.products.all, "options"] as const,
    detail: (id: string) => [...tenantQueryKeys.products.all, "detail", id] as const,
  },
  media: {
    all: ["tenant", "media"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      folderId: number | null
      mimeType: string
      rootOnly: boolean
    }) => [...tenantQueryKeys.media.all, "list", params] as const,
    metrics: () => [...tenantQueryKeys.media.all, "metrics"] as const,
    detail: (id: number) => [...tenantQueryKeys.media.all, "detail", id] as const,
  },
  mediaFolders: {
    all: ["tenant", "media-folders"] as const,
    tree: () => [...tenantQueryKeys.mediaFolders.all, "tree"] as const,
    list: (search: string) =>
      [...tenantQueryKeys.mediaFolders.all, "list", search] as const,
  },
} as const
