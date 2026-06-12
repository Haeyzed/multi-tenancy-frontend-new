"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useSearch } from "@/providers/search-provider"

export type CommandMenuItem = {
  title: string
  url: string
  group: string
  permission?: string | null
}

interface CommandMenuDialogProps {
  items: CommandMenuItem[]
  canAccess: (permission: string) => boolean
}

export function CommandMenuDialog({ items, canAccess }: CommandMenuDialogProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen],
  )

  const groupedItems = React.useMemo(() => {
    const groups = new Map<string, CommandMenuItem[]>()

    for (const item of items) {
      if (item.permission && !canAccess(item.permission)) {
        continue
      }

      const existing = groups.get(item.group) ?? []
      existing.push(item)
      groups.set(item.group, existing)
    }

    return [...groups.entries()]
  }, [canAccess, items])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-none bg-transparent">
        <CommandInput placeholder="Search pages, actions, and settings..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {groupedItems.map(([group, groupItems]) => (
            <CommandGroup key={group} heading={group}>
              {groupItems.map((item) => (
                <CommandItem
                  key={item.url}
                  value={`${group} ${item.title}`}
                  onSelect={() => runCommand(() => router.push(item.url))}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
