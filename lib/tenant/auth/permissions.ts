export const TenantPermissions = {
  dashboard: {
    view: "dashboard.view",
  },
  catalog: {
    view: "catalog.view",
    manage: "catalog.manage",
  },
  orders: {
    view: "orders.view",
    manage: "orders.manage",
  },
  inventory: {
    view: "inventory.view",
    manage: "inventory.manage",
  },
  settings: {
    view: "settings.view",
    manage: "settings.manage",
  },
  staff: {
    view: "staff.view",
    manage: "staff.manage",
  },
} as const

export type TenantPermissionName =
  | (typeof TenantPermissions.dashboard)[keyof typeof TenantPermissions.dashboard]
  | (typeof TenantPermissions.catalog)[keyof typeof TenantPermissions.catalog]
  | (typeof TenantPermissions.orders)[keyof typeof TenantPermissions.orders]
  | (typeof TenantPermissions.inventory)[keyof typeof TenantPermissions.inventory]
  | (typeof TenantPermissions.settings)[keyof typeof TenantPermissions.settings]
  | (typeof TenantPermissions.staff)[keyof typeof TenantPermissions.staff]

export interface TenantPermissionSubject {
  permission_names?: string[]
  role_names?: string[]
  is_store_owner?: boolean
}

export function getEffectivePermissionNames(
  subject: TenantPermissionSubject | null | undefined,
): string[] {
  return subject?.permission_names ?? []
}

export function hasTenantPermission(
  subject: TenantPermissionSubject | null | undefined,
  permission: TenantPermissionName | string,
): boolean {
  if (!subject) {
    return false
  }

  if (subject.is_store_owner) {
    return true
  }

  return getEffectivePermissionNames(subject).includes(permission)
}

export function hasAnyTenantPermission(
  subject: TenantPermissionSubject | null | undefined,
  permissions: Array<TenantPermissionName | string>,
): boolean {
  return permissions.some((permission) => hasTenantPermission(subject, permission))
}

export function hasAllTenantPermissions(
  subject: TenantPermissionSubject | null | undefined,
  permissions: Array<TenantPermissionName | string>,
): boolean {
  return permissions.every((permission) => hasTenantPermission(subject, permission))
}

export const TenantRoutePermissions: Record<string, TenantPermissionName | null> = {
  "/admin/dashboard": TenantPermissions.dashboard.view,
  "/admin/products": TenantPermissions.catalog.view,
  "/admin/brands": TenantPermissions.catalog.view,
  "/admin/categories": TenantPermissions.catalog.view,
  "/admin/users": TenantPermissions.staff.view,
  "/admin/roles": TenantPermissions.staff.view,
  "/admin/permissions": TenantPermissions.staff.view,
  "/admin/general-settings": TenantPermissions.settings.view,
  "/admin/stores": TenantPermissions.settings.view,
  "/admin/media": TenantPermissions.settings.view,
  "/admin/warehouses": TenantPermissions.inventory.view,
}

export function getTenantRoutePermission(pathname: string): TenantPermissionName | null {
  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname

  if (normalizedPath in TenantRoutePermissions) {
    return TenantRoutePermissions[normalizedPath]
  }

  for (const [route, permission] of Object.entries(TenantRoutePermissions)) {
    if (route !== "/admin/dashboard" && normalizedPath.startsWith(`${route}/`)) {
      return permission
    }
  }

  return null
}
