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
  planFeatures: {
    all: ["plan-features"] as const,
    byPlan: (planId: string) =>
      [...queryKeys.planFeatures.all, "by-plan", planId] as const,
  },
} as const
