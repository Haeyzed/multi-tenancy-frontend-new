"use client"

import * as React from "react"

import { NavMain } from "@/components/central/nav-main"
import { NavProjects } from "@/components/central/nav-projects"
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
  BookOpenIcon,
  BotIcon,
  FrameIcon,
  LayersIcon,
  MapIcon,
  PieChartIcon,
  Settings2Icon,
  TerminalSquareIcon,
} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/central/dashboard",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [],
    },
    {
      title: "Tenants",
      url: "/central/tenants",
      icon: <BotIcon />,
      items: [
        { title: "All tenants", url: "/central/tenants" },
        { title: "Onboarding", url: "#" },
      ],
    },
    {
      title: "Subscriptions",
      url: "/central/subscriptions",
      icon: <FrameIcon />,
      items: [
        { title: "All subscriptions", url: "/central/subscriptions" },
      ],
    },
    {
      title: "Plans",
      url: "/central/plans",
      icon: <LayersIcon />,
      items: [
        { title: "All plans", url: "/central/plans" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        { title: "General", url: "#" },
        { title: "Billing", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Plans",
      url: "/central/plans",
      icon: <LayersIcon />,
    },
    {
      name: "Subscriptions",
      url: "/central/subscriptions",
      icon: <FrameIcon />,
    },
    {
      name: "Invoices",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Support",
      url: "#",
      icon: <MapIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
