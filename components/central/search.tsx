"use client"

import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"
import { useSearch } from "@/providers/search-provider"

export function Search({
  className,
  placeholder = "Search",
  ...props
}: React.ComponentProps<typeof Button> & { placeholder?: string }) {
  const { setOpen } = useSearch()

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-8 w-full max-w-sm justify-start gap-2 bg-muted/40 text-muted-foreground shadow-none",
        className,
      )}
      onClick={() => setOpen(true)}
      {...props}
    >
      <SearchIcon className="size-4 shrink-0" />
      <span className="hidden truncate sm:inline">{placeholder}</span>
      <KbdGroup className="ms-auto hidden sm:inline-flex">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Button>
  )
}
