import { Permissions } from "@/lib/central/auth/permissions"

export type NavSearchItem = {
  title: string
  url: string
  group: string
  permission?: string | null
}

export const centralNavSearchItems: NavSearchItem[] = [
  {
    group: "General",
    title: "Dashboard",
    url: "/central/dashboard",
    permission: Permissions.dashboard.view,
  },
  {
    group: "Tenants",
    title: "Tenants",
    url: "/central/tenants",
    permission: Permissions.tenants.view,
  },
  {
    group: "Billing",
    title: "Plans",
    url: "/central/plans",
    permission: Permissions.billing.view,
  },
  {
    group: "Billing",
    title: "Subscriptions",
    url: "/central/subscriptions",
    permission: Permissions.billing.view,
  },
  {
    group: "Access control",
    title: "Users",
    url: "/central/users",
    permission: Permissions.users.view,
  },
  {
    group: "Access control",
    title: "Roles",
    url: "/central/roles",
    permission: Permissions.roles.view,
  },
  {
    group: "Access control",
    title: "Permissions",
    url: "/central/permissions",
    permission: Permissions.permissions.view,
  },
  {
    group: "Platform",
    title: "Announcements",
    url: "/central/announcements",
    permission: Permissions.platform.view,
  },
]
