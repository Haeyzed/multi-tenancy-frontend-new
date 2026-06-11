"use client"

import * as React from "react"

import { NavMain, type NavMainItem } from "@/components/central/nav-main"
import { StoreBrand } from "@/components/tenant/store-brand"
import { TenantNavUser } from "@/components/tenant/nav-user"
import { useTenantPermissions } from "@/hooks/use-tenant-permissions"
import {
  hasTenantPermission,
  TenantPermissions,
} from "@/lib/tenant/auth/permissions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  ShieldIcon,
  WarehouseIcon,
} from "lucide-react"

const navItems: NavMainItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: <LayoutDashboardIcon />,
    permission: TenantPermissions.dashboard.view,
  },
  {
    title: "Catalog",
    url: "/admin/products",
    icon: <PackageIcon />,
    permission: TenantPermissions.catalog.view,
    items: [
      {
        title: "Products",
        url: "/admin/products",
        permission: TenantPermissions.catalog.view,
      },
      {
        title: "Brands",
        url: "/admin/brands",
        permission: TenantPermissions.catalog.view,
      },
      {
        title: "Categories",
        url: "/admin/categories",
        permission: TenantPermissions.catalog.view,
      },
    ],
  },
  {
    title: "Inventory",
    url: "/admin/warehouses",
    icon: <WarehouseIcon />,
    permission: TenantPermissions.inventory.view,
    items: [
      {
        title: "Warehouses",
        url: "/admin/warehouses",
        permission: TenantPermissions.inventory.view,
      },
    ],
  },
  {
    title: "Staff",
    url: "/admin/users",
    icon: <ShieldIcon />,
    permission: TenantPermissions.staff.view,
    items: [
      {
        title: "Users",
        url: "/admin/users",
        permission: TenantPermissions.staff.view,
      },
      {
        title: "Roles",
        url: "/admin/roles",
        permission: TenantPermissions.staff.view,
      },
      {
        title: "Permissions",
        url: "/admin/permissions",
        permission: TenantPermissions.staff.view,
      },
    ],
  },
  {
    title: "Settings",
    url: "/admin/general-settings",
    icon: <SettingsIcon />,
    permission: TenantPermissions.settings.view,
    items: [
      {
        title: "General",
        url: "/admin/general-settings",
        permission: TenantPermissions.settings.view,
      },
      {
        title: "Stores",
        url: "/admin/stores",
        permission: TenantPermissions.settings.view,
      },
      {
        title: "Media library",
        url: "/admin/media",
        permission: TenantPermissions.settings.view,
      },
    ],
  },
]

function filterNavItems(
  items: NavMainItem[],
  can: (permission: string) => boolean,
): NavMainItem[] {
  return items
    .map((item) => {
      if (item.items && item.items.length > 0) {
        const visibleChildren = item.items.filter(
          (subItem) => subItem.permission == null || can(subItem.permission),
        )

        if (visibleChildren.length === 0) {
          return null
        }

        return { ...item, items: visibleChildren }
      }

      if (item.permission != null && !can(item.permission)) {
        return null
      }

      return item
    })
    .filter((item): item is NavMainItem => item !== null)
}

export function TenantAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useTenantPermissions()
  const visibleItems = React.useMemo(
    () =>
      filterNavItems(navItems, (permission) =>
        hasTenantPermission(user, permission),
      ),
    [user],
  )

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <StoreBrand />
      </SidebarHeader>
      <SidebarContent className="gap-0 py-0">
        <NavMain items={visibleItems} />
      </SidebarContent>
      <SidebarFooter>
        <TenantNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
