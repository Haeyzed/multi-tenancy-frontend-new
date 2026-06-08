"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { CircleCheck, RotateCcw, Settings2 } from "lucide-react"

import {
  IconDir,
  IconLayoutCompact,
  IconLayoutDefault,
  IconLayoutFull,
  IconSidebarFloating,
  IconSidebarInset,
  IconSidebarSidebar,
  IconThemeDark,
  IconThemeLight,
  IconThemeSystem,
} from "@/assets/custom"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
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
  type Direction,
  type SidebarLayout,
  type SidebarVariant,
  themeColorOptions,
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
    <RadioPrimitive.Root
      value={value}
      className="group/radio-group-item flex w-full flex-col outline-none transition duration-200"
    >
      <div
        className={cn(
          "relative rounded-[6px] ring-1 ring-border",
          "group-data-checked/radio-group-item:shadow-lg group-data-checked/radio-group-item:ring-primary",
        )}
      >
        <CircleCheck
          className={cn(
            "absolute top-0 right-0 z-10 size-6 translate-x-1/2 -translate-y-1/2",
            "fill-primary stroke-primary-foreground",
            "opacity-0 group-data-checked/radio-group-item:opacity-100",
          )}
          aria-hidden="true"
        />
        <Icon
          className={cn(
            "h-auto w-full overflow-hidden rounded-[6px]",
            !isTheme &&
              "fill-primary stroke-primary group-data-unchecked/radio-group-item:fill-muted-foreground group-data-unchecked/radio-group-item:stroke-muted-foreground",
          )}
          aria-hidden="true"
        />
      </div>
      <span className="mt-1 text-center text-xs font-medium">{label}</span>
    </RadioPrimitive.Root>
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
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select theme preference"
      >
        <ConfigRadioItem
          value="system"
          label="System"
          icon={IconThemeSystem}
        />
        <ConfigRadioItem
          value="light"
          label="Light"
          icon={IconThemeLight}
          isTheme
        />
        <ConfigRadioItem
          value="dark"
          label="Dark"
          icon={IconThemeDark}
          isTheme
        />
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
                "size-9 rounded-full transition-transform hover:scale-105",
                option.className,
                selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              )}
            />
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
        onReset={() => setSidebarVariant("sidebar")}
        resetAriaLabel="Reset sidebar style to default"
      />
      <RadioGroup
        value={config.sidebarVariant}
        onValueChange={(value) => setSidebarVariant(value as SidebarVariant)}
        className="grid w-full max-w-md grid-cols-3 gap-4"
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
        className="grid w-full max-w-md grid-cols-3 gap-4"
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

function IconDirLtr(props: React.SVGProps<SVGSVGElement>) {
  return <IconDir dir="ltr" {...props} />
}

function IconDirRtl(props: React.SVGProps<SVGSVGElement>) {
  return <IconDir dir="rtl" {...props} />
}

function DirectionConfig() {
  const { config, setDirection } = useThemeConfig()

  return (
    <section>
      <SectionTitle
        title="Direction"
        showReset
        onReset={() => setDirection("ltr")}
        resetAriaLabel="Reset text direction to default"
      />
      <RadioGroup
        value={config.direction}
        onValueChange={(value) => setDirection(value as Direction)}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select text direction"
      >
        <ConfigRadioItem
          value="ltr"
          label="Left to Right"
          icon={IconDirLtr}
        />
        <ConfigRadioItem
          value="rtl"
          label="Right to Left"
          icon={IconDirRtl}
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
        nativeButton={false}
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Theme settings">
            <Settings2 />
          </Button>
        }
      />
      <SheetContent
        side="right"
        className="app-config-sheet flex w-full flex-col gap-0 overflow-y-auto border-l bg-background p-0 sm:max-w-md"
        showCloseButton
      >
        <SheetHeader className="px-6 py-5">
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
          <DirectionConfig />
        </div>

        <SheetFooter className="border-t border-border/60 px-6 py-4">
          <Button className="w-full" onClick={resetConfig}>
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
