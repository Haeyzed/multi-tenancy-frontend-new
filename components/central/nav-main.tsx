"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
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

function NavMainLink({
  item,
  pathname,
}: {
  item: NavMainItem
  pathname: string
}) {
  return (
    <SidebarMenuItem>
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
  )
}

function NavMainCollapsible({
  item,
  pathname,
}: {
  item: NavMainItem
  pathname: string
}) {
  return (
    <SidebarMenuItem>
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
              <ChevronRightIcon className="ms-auto transition-transform duration-200 group-data-open/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          }
        />
        <CollapsibleContent className="collapsible-content">
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
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
  )
}

function NavMainCollapsedDropdown({
  item,
  pathname,
}: {
  item: NavMainItem
  pathname: string
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isNavItemActive(pathname, item)}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          }
        />
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
            {item.items?.map((subItem) => (
              <DropdownMenuItem
                key={subItem.title}
                className={cn(
                  isItemActive(pathname, subItem.url) &&
                    "bg-accent text-accent-foreground",
                )}
                render={
                  <Link href={subItem.url}>
                    <span>{subItem.title}</span>
                  </Link>
                }
              />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()

  return (
    <SidebarGroup className="p-2">
      <SidebarMenu>
        {items.map((item) => {
          if (item.items && item.items.length > 0) {
            if (state === "collapsed" && !isMobile) {
              return (
                <NavMainCollapsedDropdown
                  key={item.title}
                  item={item}
                  pathname={pathname}
                />
              )
            }

            return (
              <NavMainCollapsible
                key={item.title}
                item={item}
                pathname={pathname}
              />
            )
          }

          return (
            <NavMainLink key={item.title} item={item} pathname={pathname} />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
