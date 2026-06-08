"use client"

import * as React from "react"

import { AppSidebar } from "@/components/central/app-sidebar"
import { ConfigDrawer } from "@/components/central/config-drawer"
import { Search } from "@/components/central/search"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import {
  getSidebarCollapsible,
  getSidebarOpen,
} from "@/lib/theme-config"
import { useThemeConfig } from "@/providers/theme-config-provider"
import { SearchProvider } from "@/providers/search-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

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
      <SearchProvider>
        <AppSidebar
          variant={config.sidebarVariant}
          collapsible={sidebarCollapsible}
        />
        <SidebarInset className="@container/content min-w-0 overflow-x-clip overflow-y-visible">
          <Header fixed>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Search className="max-w-md" />
            </div>
            <ConfigDrawer />
          </Header>
          <Main>{children}</Main>
        </SidebarInset>
      </SearchProvider>
    </SidebarProvider>
  )
}
