"use client"

import * as React from "react"

import { AppSidebar } from "@/components/central/app-sidebar"
import { ConfigDrawer } from "@/components/central/config-drawer"
import { Separator } from "@/components/ui/separator"
import {
  getSidebarCollapsible,
  getSidebarOpen,
} from "@/lib/theme-config"
import { useThemeConfig } from "@/providers/theme-config-provider"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { config, setSidebarLayout } = useThemeConfig()
  const sidebarOpen = getSidebarOpen(config.sidebarLayout)
  const sidebarCollapsible = getSidebarCollapsible(config.sidebarLayout)

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) {
        setSidebarLayout("default")
        return
      }

      setSidebarLayout(
        config.sidebarLayout === "offcanvas" ? "offcanvas" : "icon",
      )
    },
    [config.sidebarLayout, setSidebarLayout],
  )

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={handleOpenChange}>
      <AppSidebar
        variant={config.sidebarVariant}
        collapsible={sidebarCollapsible}
      />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ms-1" />
            <Separator
              orientation="vertical"
              className="me-2 data-vertical:h-4 data-vertical:self-auto"
            />
          </div>
          <div className="flex items-center gap-2 px-4">
            <ConfigDrawer />
          </div>
        </header>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0 sm:gap-6 sm:p-6 sm:pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
