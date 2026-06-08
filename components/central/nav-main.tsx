"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

export interface NavMainItem {
  title: string
  url: string
  icon?: React.ReactNode
  permission?: string | null
  items?: {
    title: string
    url: string
    permission?: string | null
  }[]
}

function isItemActive(pathname: string, url: string) {
  if (url === "#") {
    return false
  }

  return pathname === url || pathname.startsWith(`${url}/`)
}

function isNavItemActive(pathname: string, item: NavMainItem) {
  if (isItemActive(pathname, item.url)) {
    return true
  }

  return item.items?.some((subItem) => isItemActive(pathname, subItem.url)) ?? false
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="p-2">
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
            <SidebarMenuItem key={item.title}>
              <Collapsible
                defaultOpen={isNavItemActive(pathname, item)}
                className="group/collapsible"
              >
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isNavItemActive(pathname, item)}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                      <ChevronRightIcon className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={isItemActive(pathname, subItem.url)}
                          render={
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          }
                        />
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isItemActive(pathname, item.url)}
                render={
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
