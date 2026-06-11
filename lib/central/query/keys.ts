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
  paymentMethods: {
    all: ["payment-methods"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      tenantId: string | null
    }) => [...queryKeys.paymentMethods.all, "list", params] as const,
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
  apiKeys: {
    all: ["api-keys"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      isActive: string
      tenantId: string | null
    }) => [...queryKeys.apiKeys.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.apiKeys.all, "metrics", tenantId] as const,
  },
  healthChecks: {
    all: ["health-checks"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      status: string
      tenantId: string | null
    }) => [...queryKeys.healthChecks.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.healthChecks.all, "metrics", tenantId] as const,
  },
  errorLogs: {
    all: ["error-logs"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      severity: string
      resolution: string
      tenantId: string | null
    }) => [...queryKeys.errorLogs.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.errorLogs.all, "metrics", tenantId] as const,
  },
  supportTickets: {
    all: ["support-tickets"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      status: string
      priority: string
      category: string
      tenantId: string | null
    }) => [...queryKeys.supportTickets.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.supportTickets.all, "metrics", tenantId] as const,
    detail: (ticketId: number) =>
      [...queryKeys.supportTickets.all, "detail", ticketId] as const,
  },
  changelog: {
    all: ["changelog"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      type: string
      isPublished: string
    }) => [...queryKeys.changelog.all, "list", params] as const,
  },
  activityLog: {
    all: ["activity-log"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      logName: string
      event: string
    }) => [...queryKeys.activityLog.all, "list", params] as const,
  },
  impersonationTokens: {
    all: ["impersonation-tokens"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      status: string
      tenantId: string | null
    }) => [...queryKeys.impersonationTokens.all, "list", params] as const,
  },
  usageRecords: {
    all: ["usage-records"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      metric: string
      tenantId: string | null
    }) => [...queryKeys.usageRecords.all, "list", params] as const,
  },
  tenantMetrics: {
    all: ["tenant-metrics"] as const,
    list: (params: {
      page: number
      perPage: number
      search: string
      tenantId: string | null
    }) => [...queryKeys.tenantMetrics.all, "list", params] as const,
    metrics: (tenantId: string | null) =>
      [...queryKeys.tenantMetrics.all, "metrics", tenantId] as const,
  },
} as const
