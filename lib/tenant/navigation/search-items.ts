import { TenantPermissions } from "@/lib/tenant/auth/permissions"

import type { CommandMenuItem } from "@/components/shared/command-menu-dialog"

export const tenantNavSearchItems: CommandMenuItem[] = [
  {
    group: "General",
    title: "Dashboard",
    url: "/admin/dashboard",
    permission: TenantPermissions.dashboard.view,
  },
  {
    group: "Catalog",
    title: "Products",
    url: "/admin/products",
    permission: TenantPermissions.catalog.view,
  },
  {
    group: "Catalog",
    title: "Brands",
    url: "/admin/brands",
    permission: TenantPermissions.catalog.view,
  },
  {
    group: "Catalog",
    title: "Categories",
    url: "/admin/categories",
    permission: TenantPermissions.catalog.view,
  },
  {
    group: "Inventory",
    title: "Warehouses",
    url: "/admin/warehouses",
    permission: TenantPermissions.inventory.view,
  },
  {
    group: "Staff",
    title: "Users",
    url: "/admin/users",
    permission: TenantPermissions.staff.view,
  },
  {
    group: "Staff",
    title: "Roles",
    url: "/admin/roles",
    permission: TenantPermissions.staff.view,
  },
  {
    group: "Staff",
    title: "Permissions",
    url: "/admin/permissions",
    permission: TenantPermissions.staff.view,
  },
  {
    group: "Settings",
    title: "General settings",
    url: "/admin/general-settings",
    permission: TenantPermissions.settings.view,
  },
  {
    group: "Settings",
    title: "Stores",
    url: "/admin/stores",
    permission: TenantPermissions.settings.view,
  },
  {
    group: "Settings",
    title: "Media library",
    url: "/admin/media",
    permission: TenantPermissions.settings.view,
  },
]
