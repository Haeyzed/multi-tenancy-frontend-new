export const Permissions = {
  dashboard: {
    view: "dashboard.view",
  },
  users: {
    view: "users.view",
    create: "users.create",
    update: "users.update",
    delete: "users.delete",
  },
  roles: {
    view: "roles.view",
    create: "roles.create",
    update: "roles.update",
    delete: "roles.delete",
  },
  permissions: {
    view: "permissions.view",
    create: "permissions.create",
    update: "permissions.update",
    delete: "permissions.delete",
  },
  tenants: {
    view: "tenants.view",
    create: "tenants.create",
    update: "tenants.update",
    delete: "tenants.delete",
  },
  billing: {
    view: "billing.view",
    manage: "billing.manage",
  },
  support: {
    view: "support.view",
    manage: "support.manage",
  },
  platform: {
    view: "platform.view",
    manage: "platform.manage",
  },
  monitoring: {
    view: "monitoring.view",
    manage: "monitoring.manage",
  },
  apiKeys: {
    view: "api-keys.view",
    manage: "api-keys.manage",
  },
  impersonation: {
    use: "impersonation.use",
  },
} as const

export type PermissionName =
  | (typeof Permissions.dashboard)[keyof typeof Permissions.dashboard]
  | (typeof Permissions.users)[keyof typeof Permissions.users]
  | (typeof Permissions.roles)[keyof typeof Permissions.roles]
  | (typeof Permissions.permissions)[keyof typeof Permissions.permissions]
  | (typeof Permissions.tenants)[keyof typeof Permissions.tenants]
  | (typeof Permissions.billing)[keyof typeof Permissions.billing]
  | (typeof Permissions.support)[keyof typeof Permissions.support]
  | (typeof Permissions.platform)[keyof typeof Permissions.platform]
  | (typeof Permissions.monitoring)[keyof typeof Permissions.monitoring]
  | (typeof Permissions.apiKeys)[keyof typeof Permissions.apiKeys]
  | (typeof Permissions.impersonation)[keyof typeof Permissions.impersonation]

export interface PermissionSubject {
  permission_names?: string[]
  role_names?: string[]
  is_super_admin?: boolean
}

export function getEffectivePermissionNames(
  subject: PermissionSubject | null | undefined,
): string[] {
  if (!subject?.permission_names) {
    return []
  }

  return subject.permission_names
}

export function hasPermission(
  subject: PermissionSubject | null | undefined,
  permission: PermissionName | string,
): boolean {
  if (!subject) {
    return false
  }

  if (subject.is_super_admin) {
    return true
  }

  return getEffectivePermissionNames(subject).includes(permission)
}

export function hasAnyPermission(
  subject: PermissionSubject | null | undefined,
  permissions: Array<PermissionName | string>,
): boolean {
  return permissions.some((permission) => hasPermission(subject, permission))
}

export function hasAllPermissions(
  subject: PermissionSubject | null | undefined,
  permissions: Array<PermissionName | string>,
): boolean {
  return permissions.every((permission) => hasPermission(subject, permission))
}

export const RoutePermissions: Record<string, PermissionName | null> = {
  "/central/dashboard": Permissions.dashboard.view,
  "/central/tenants": Permissions.tenants.view,
  "/central/domains": Permissions.tenants.view,
  "/central/tenant-configs": Permissions.tenants.view,
  "/central/plans": Permissions.billing.view,
  "/central/subscriptions": Permissions.billing.view,
  "/central/invoices": Permissions.billing.view,
  "/central/payments": Permissions.billing.view,
  "/central/users": Permissions.users.view,
  "/central/roles": Permissions.roles.view,
  "/central/permissions": Permissions.permissions.view,
  "/central/announcements": Permissions.platform.view,
}

export function getRoutePermission(pathname: string): PermissionName | null {
  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname

  if (normalizedPath in RoutePermissions) {
    return RoutePermissions[normalizedPath]
  }

  for (const [route, permission] of Object.entries(RoutePermissions)) {
    if (route !== "/central/dashboard" && normalizedPath.startsWith(`${route}/`)) {
      return permission
    }
  }

  return null
}
