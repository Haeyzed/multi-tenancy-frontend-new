"use client"

import * as React from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
}

export function Header({
  className,
  fixed = true,
  children,
  ...props
}: HeaderProps) {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    function onScroll() {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener("scroll", onScroll, { passive: true })
    return () => document.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "z-50 h-16 shrink-0",
        fixed && "sticky top-0 w-[inherit]",
        offset > 10 && fixed ? "shadow-sm" : "shadow-none",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 bg-background/80 px-4 backdrop-blur-lg supports-backdrop-filter:bg-background/70 sm:gap-4",
          offset > 10 &&
            fixed &&
            "shadow-sm after:absolute after:inset-0 after:-z-10 after:bg-background/20",
        )}
      >
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="data-vertical:h-4 data-vertical:self-auto"
        />
        {children}
      </div>
    </header>
  )
}
