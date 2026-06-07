export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  tenants: {
    all: ["tenants"] as const,
    options: () => [...queryKeys.tenants.all, "options"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
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
      tenantId: string | null
    }) => [...queryKeys.subscriptions.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.subscriptions.all, "metrics", tenantId] as const,
  },
  plans: {
    all: ["plans"] as const,
    list: (params: { page: number; perPage: number; search: string }) =>
      [...queryKeys.plans.all, "list", params] as const,
    metrics: () => [...queryKeys.plans.all, "metrics"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params: { page: number; perPage: number; search: string }) =>
      [...queryKeys.users.all, "list", params] as const,
    metrics: () => [...queryKeys.users.all, "metrics"] as const,
    detail: (userId: number) =>
      [...queryKeys.users.all, "detail", userId] as const,
  },
  roles: {
    all: ["roles"] as const,
    list: (params: { page: number; perPage: number; search: string }) =>
      [...queryKeys.roles.all, "list", params] as const,
    metrics: () => [...queryKeys.roles.all, "metrics"] as const,
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
    list: (params: { page: number; perPage: number; search: string }) =>
      [...queryKeys.announcements.all, "list", params] as const,
  },
} as const
