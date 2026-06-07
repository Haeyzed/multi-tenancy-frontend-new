"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useTenant } from "@/providers/central/tenant-provider"
import { Building2Icon, ChevronsUpDownIcon, GlobeIcon } from "lucide-react"

function TenantAvatar({ label }: { label: string }) {
  return (
    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
      <span className="text-xs font-semibold uppercase">
        {label.slice(0, 2)}
      </span>
    </div>
  )
}

export function TenantSwitcher() {
  const { isMobile } = useSidebar()
  const { tenants, selectedTenant, selectedTenantId, isLoading, selectTenant } =
    useTenant()

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Skeleton className="h-12 w-full rounded-lg" />
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const activeLabel = selectedTenant?.label ?? "All tenants"
  const activeSubtitle = selectedTenant ? "Tenant workspace" : "Platform-wide view"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {selectedTenant ? (
                  <TenantAvatar label={selectedTenant.label} />
                ) : (
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Building2Icon className="size-4" />
                  </div>
                )}
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">{activeLabel}</span>
                  <span className="truncate text-xs">{activeSubtitle}</span>
                </div>
                <ChevronsUpDownIcon className="ms-auto" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-64"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Tenants
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => selectTenant(null)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <GlobeIcon className="size-3.5" />
                </div>
                <span className={selectedTenantId === null ? "font-medium" : ""}>
                  All tenants
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {tenants.map((tenant) => (
                <DropdownMenuItem
                  key={tenant.value}
                  onClick={() => selectTenant(tenant.value)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border text-[10px] font-semibold uppercase">
                    {tenant.label.slice(0, 2)}
                  </div>
                  <span
                    className={
                      tenant.value === selectedTenantId ? "font-medium" : ""
                    }
                  >
                    {tenant.label}
                  </span>
                </DropdownMenuItem>
              ))}
              {tenants.length === 0 ? (
                <DropdownMenuItem disabled className="p-2 text-muted-foreground">
                  No active tenants found.
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
