"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { CircleCheck, RotateCcw, Settings } from "lucide-react"

import {
  IconLayoutCompact,
  IconLayoutDefault,
  IconLayoutFull,
  IconSidebarFloating,
  IconSidebarInset,
  IconSidebarSidebar,
  IconThemeDark,
  IconThemeLight,
  IconThemeSystem,
} from "@/components/central/config-icons"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  sidebarLayoutOptions,
  sidebarVariantOptions,
  themeColorOptions,
  type SidebarLayout,
  type SidebarVariant,
  type ThemeColor,
} from "@/lib/theme-config"
import { useThemeConfig } from "@/providers/theme-config-provider"

type ThemeMode = "system" | "light" | "dark"

function SectionTitle({
  title,
  showReset = false,
  onReset,
  resetAriaLabel,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  resetAriaLabel?: string
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {showReset && onReset ? (
        <button
          type="button"
          onClick={onReset}
          aria-label={resetAriaLabel ?? `Reset ${title.toLowerCase()}`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

function ConfigRadioItem({
  value,
  label,
  icon: Icon,
  isTheme = false,
}: {
  value: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  isTheme?: boolean
}) {
  return (
    <RadioGroupItem
      value={value}
      className={cn(
        "relative flex size-auto w-full flex-col gap-2 rounded-lg border-2 bg-transparent p-2 shadow-none ring-0 after:hidden focus-visible:ring-0",
        "border-muted bg-muted/30 hover:border-muted-foreground/30",
        "data-checked:border-primary data-checked:bg-primary/5",
        "[&_[data-slot=radio-group-indicator]]:hidden",
        isTheme && "text-foreground",
      )}
    >
      <Icon className="h-auto w-full" />
      <span className="text-xs font-medium">{label}</span>
      <CircleCheck className="absolute -top-2 -right-2 size-5 fill-primary stroke-primary-foreground opacity-0 data-checked:opacity-100" />
    </RadioGroupItem>
  )
}

function ThemeConfig() {
  const { theme, setTheme } = useTheme()
  const currentTheme = (theme ?? "system") as ThemeMode

  return (
    <section>
      <SectionTitle
        title="Theme"
        showReset
        onReset={() => setTheme("system")}
        resetAriaLabel="Reset theme preference to default"
      />
      <RadioGroup
        value={currentTheme}
        onValueChange={(value) => setTheme(value as ThemeMode)}
        className="grid w-full grid-cols-3 gap-4"
        aria-label="Select theme preference"
      >
        <ConfigRadioItem
          value="system"
          label="System"
          icon={IconThemeSystem}
          isTheme
        />
        <ConfigRadioItem value="light" label="Light" icon={IconThemeLight} isTheme />
        <ConfigRadioItem value="dark" label="Dark" icon={IconThemeDark} isTheme />
      </RadioGroup>
    </section>
  )
}

function ThemeColorConfig() {
  const { config, setThemeColor } = useThemeConfig()

  return (
    <section>
      <SectionTitle title="Theme color" />
      <div
        className="flex flex-wrap gap-3"
        role="radiogroup"
        aria-label="Select theme color"
      >
        {themeColorOptions.map((option) => {
          const selected = config.themeColor === option.value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected ? "true" : "false"}
              aria-label={option.label}
              title={option.label}
              onClick={() => setThemeColor(option.value)}
              className={cn(
                "relative size-9 rounded-full ring-2 ring-offset-2 ring-offset-background transition-shadow",
                option.className,
                selected ? "ring-primary" : "ring-transparent hover:ring-border",
              )}
            >
              {selected ? (
                <CircleCheck className="absolute inset-0 m-auto size-4 fill-primary stroke-primary-foreground" />
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function SidebarConfig() {
  const { config, setSidebarVariant } = useThemeConfig()

  return (
    <section>
      <SectionTitle
        title="Sidebar"
        showReset
        onReset={() => setSidebarVariant("inset")}
        resetAriaLabel="Reset sidebar style to default"
      />
      <RadioGroup
        value={config.sidebarVariant}
        onValueChange={(value) => setSidebarVariant(value as SidebarVariant)}
        className="grid w-full grid-cols-3 gap-4"
        aria-label="Select sidebar style"
      >
        <ConfigRadioItem value="inset" label="Inset" icon={IconSidebarInset} />
        <ConfigRadioItem
          value="floating"
          label="Floating"
          icon={IconSidebarFloating}
        />
        <ConfigRadioItem value="sidebar" label="Sidebar" icon={IconSidebarSidebar} />
      </RadioGroup>
    </section>
  )
}

function LayoutConfig() {
  const { config, setSidebarLayout } = useThemeConfig()

  return (
    <section>
      <SectionTitle
        title="Layout"
        showReset
        onReset={() => setSidebarLayout("default")}
        resetAriaLabel="Reset layout options to default"
      />
      <RadioGroup
        value={config.sidebarLayout}
        onValueChange={(value) => setSidebarLayout(value as SidebarLayout)}
        className="grid w-full grid-cols-3 gap-4"
        aria-label="Select layout style"
      >
        <ConfigRadioItem
          value="default"
          label="Default"
          icon={IconLayoutDefault}
        />
        <ConfigRadioItem
          value="icon"
          label="Compact"
          icon={IconLayoutCompact}
        />
        <ConfigRadioItem
          value="offcanvas"
          label="Full layout"
          icon={IconLayoutFull}
        />
      </RadioGroup>
    </section>
  )
}

export function ConfigDrawer() {
  const { resetConfig } = useThemeConfig()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Theme settings">
            <Settings />
          </Button>
        }
      />
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md"
        showCloseButton
      >
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-lg font-semibold">Theme Settings</SheetTitle>
          <SheetDescription>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
          <ThemeConfig />
          <ThemeColorConfig />
          <SidebarConfig />
          <LayoutConfig />
        </div>

        <SheetFooter className="border-t px-6 py-4">
          <Button className="w-full" onClick={resetConfig}>
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
