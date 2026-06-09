export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    overview: (params?: { start_date?: string; end_date?: string }) =>
      [...queryKeys.dashboard.all, "overview", params ?? {}] as const,
  },
  tenants: {
    all: ["tenants"] as const,
    options: () => [...queryKeys.tenants.all, "options"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      status: string
      tenantId: string | null
    }) => [...queryKeys.tenants.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.tenants.all, "metrics", tenantId] as const,
  },
  subscriptions: {
    all: ["subscriptions"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      status: string
      tenantId: string | null
    }) => [...queryKeys.subscriptions.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.subscriptions.all, "metrics", tenantId] as const,
  },
  invoices: {
    all: ["invoices"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      status: string
      tenantId: string | null
    }) => [...queryKeys.invoices.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.invoices.all, "metrics", tenantId] as const,
  },
  payments: {
    all: ["payments"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      status: string
      tenantId: string | null
    }) => [...queryKeys.payments.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.payments.all, "metrics", tenantId] as const,
  },
  plans: {
    all: ["plans"] as const,
    options: () => [...queryKeys.plans.all, "options"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      isActive: string
      isPublic: string
    }) => [...queryKeys.plans.all, "list", params] as const,
    metrics: () => [...queryKeys.plans.all, "metrics"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      isActive: string
    }) => [...queryKeys.users.all, "list", params] as const,
    metrics: () => [...queryKeys.users.all, "metrics"] as const,
    detail: (userId: number) =>
      [...queryKeys.users.all, "detail", userId] as const,
  },
  roles: {
    all: ["roles"] as const,
    list: (params: { page: number; perPage: number; search: string }) =>
      [...queryKeys.roles.all, "list", params] as const,
    metrics: () => [...queryKeys.roles.all, "metrics"] as const,
    permissionsMatrix: (guard?: string) =>
      [...queryKeys.roles.all, "permissions-matrix", guard ?? "web"] as const,
    permissions: (roleId: number) =>
      [...queryKeys.roles.all, "permissions", roleId] as const,
  },
  permissions: {
    all: ["permissions"] as const,
    list: (params: { page: number; perPage: number; search: string }) =>
      [...queryKeys.permissions.all, "list", params] as const,
    metrics: () => [...queryKeys.permissions.all, "metrics"] as const,
  },
  planFeatures: {
    all: ["plan-features"] as const,
    byPlan: (planId: string) =>
      [...queryKeys.planFeatures.all, "by-plan", planId] as const,
  },
  announcements: {
    all: ["announcements"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      isActive: string
      type: string
      targetAudience: string
    }) => [...queryKeys.announcements.all, "list", params] as const,
    metrics: () => [...queryKeys.announcements.all, "metrics"] as const,
  },
  domains: {
    all: ["domains"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      verified: string
      tenantId: string | null
    }) => [...queryKeys.domains.all, "list", params] as const,
  },
  tenantConfigs: {
    all: ["tenant-configs"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      tenantId: string | null
    }) => [...queryKeys.tenantConfigs.all, "list", params] as const,
  },
} as const
