export const tenantQueryKeys = {
  bootstrap: {
    all: ["tenant", "bootstrap"] as const,
    public: () => [...tenantQueryKeys.bootstrap.all, "public"] as const,
  },
  auth: {
    all: ["tenant", "auth"] as const,
    me: () => [...tenantQueryKeys.auth.all, "me"] as const,
  },
} as const
