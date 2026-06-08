"use client"

import * as React from "react"

import { NavMain, type NavMainItem } from "@/components/central/nav-main"
import { NavUser } from "@/components/central/nav-user"
import { TenantSwitcher } from "@/components/central/tenant-switcher"
import { usePermissions } from "@/hooks/use-permissions"
import { hasPermission, Permissions } from "@/lib/central/auth/permissions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Building2Icon,
  CreditCardIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  ShieldIcon,
} from "lucide-react"

const navItems: NavMainItem[] = [
  {
    title: "Dashboard",
    url: "/central/dashboard",
    icon: <LayoutDashboardIcon />,
    permission: Permissions.dashboard.view,
  },
  {
    title: "Tenants",
    url: "/central/tenants",
    icon: <Building2Icon />,
    permission: Permissions.tenants.view,
    items: [
      {
        title: "Tenants",
        url: "/central/tenants",
        permission: Permissions.tenants.view,
      },
    ],
  },
  {
    title: "Billing",
    url: "/central/plans",
    icon: <CreditCardIcon />,
    permission: Permissions.billing.view,
    items: [
      {
        title: "Plans",
        url: "/central/plans",
        permission: Permissions.billing.view,
      },
      {
        title: "Subscriptions",
        url: "/central/subscriptions",
        permission: Permissions.billing.view,
      },
    ],
  },
  {
    title: "Access control",
    url: "/central/users",
    icon: <ShieldIcon />,
    items: [
      {
        title: "Users",
        url: "/central/users",
        permission: Permissions.users.view,
      },
      {
        title: "Roles",
        url: "/central/roles",
        permission: Permissions.roles.view,
      },
      {
        title: "Permissions",
        url: "/central/permissions",
        permission: Permissions.permissions.view,
      },
    ],
  },
  {
    title: "Platform",
    url: "/central/announcements",
    icon: <MegaphoneIcon />,
    permission: Permissions.platform.view,
    items: [
      {
        title: "Announcements",
        url: "/central/announcements",
        permission: Permissions.platform.view,
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
          (subItem) =>
            subItem.permission == null || can(subItem.permission),
        )

        if (visibleChildren.length === 0) {
          return null
        }

        return {
          ...item,
          items: visibleChildren,
        }
      }

      if (item.permission != null && !can(item.permission)) {
        return null
      }

      return item
    })
    .filter((item): item is NavMainItem => item !== null)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = usePermissions()
  const visibleItems = React.useMemo(
    () => filterNavItems(navItems, (permission) => hasPermission(user, permission)),
    [user],
  )

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TenantSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
