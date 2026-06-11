"use client"

import Link from "next/link"
import { GalleryVerticalEndIcon } from "lucide-react"

import { useTenantBootstrap } from "@/providers/tenant/tenant-bootstrap-provider"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function StoreBrand() {
  const { companyName, bootstrap } = useTenantBootstrap()
  const logoUrl = bootstrap?.primary_store?.logo_url

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" render={<Link href="/admin/dashboard" />}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={companyName}
              className="size-8 rounded-lg object-cover"
            />
          ) : (
            <div className="app-brand-mark flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
          )}
          <div className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-medium">{companyName}</span>
            <span className="truncate text-xs text-muted-foreground">
              Store admin
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
