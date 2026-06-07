"use client"

import * as React from "react"

import { NavMain, type NavMainItem } from "@/components/central/nav-main"
import { NavUser } from "@/components/central/nav-user"
import { TenantSwitcher } from "@/components/central/tenant-switcher"
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
  },
  {
    title: "Tenants",
    url: "/central/tenants",
    icon: <Building2Icon />,
    items: [{ title: "Tenants", url: "/central/tenants" }],
  },
  {
    title: "Billing",
    url: "/central/plans",
    icon: <CreditCardIcon />,
    items: [
      { title: "Plans", url: "/central/plans" },
      { title: "Subscriptions", url: "/central/subscriptions" },
    ],
  },
  {
    title: "Access control",
    url: "/central/users",
    icon: <ShieldIcon />,
    items: [
      { title: "Users", url: "/central/users" },
      { title: "Roles", url: "/central/roles" },
      { title: "Permissions", url: "/central/permissions" },
    ],
  },
  {
    title: "Platform",
    url: "/central/announcements",
    icon: <MegaphoneIcon />,
    items: [{ title: "Announcements", url: "/central/announcements" }],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
