export type SidebarVariant = "inset" | "floating" | "sidebar"
export type SidebarLayout = "default" | "icon" | "offcanvas"
export type ThemeColor = "green" | "red" | "blue" | "violet" | "orange" | "rose"
export type Direction = "ltr" | "rtl"

export type ThemeConfig = {
  themeColor: ThemeColor
  sidebarVariant: SidebarVariant
  sidebarLayout: SidebarLayout
  direction: Direction
}

export const THEME_CONFIG_STORAGE_KEY = "app-theme-config"

export const defaultThemeConfig: ThemeConfig = {
  themeColor: "green",
  sidebarVariant: "sidebar",
  sidebarLayout: "default",
  direction: "ltr",
}

export const themeColorOptions: {
  value: ThemeColor
  label: string
  className: string
}[] = [
  { value: "green", label: "Green", className: "bg-[oklch(0.527_0.154_150.069)]" },
  { value: "red", label: "Red", className: "bg-[oklch(0.55_0.18_25)]" },
  { value: "blue", label: "Blue", className: "bg-[oklch(0.546_0.215_262.881)]" },
  { value: "violet", label: "Violet", className: "bg-[oklch(0.541_0.198_293.009)]" },
  { value: "orange", label: "Orange", className: "bg-[oklch(0.666_0.179_58.318)]" },
  { value: "rose", label: "Rose", className: "bg-[oklch(0.577_0.215_12)]" },
]

export const sidebarVariantOptions: {
  value: SidebarVariant
  label: string
}[] = [
  { value: "inset", label: "Inset" },
  { value: "floating", label: "Floating" },
  { value: "sidebar", label: "Sidebar" },
]

export const sidebarLayoutOptions: {
  value: SidebarLayout
  label: string
}[] = [
  { value: "default", label: "Default" },
  { value: "icon", label: "Compact" },
  { value: "offcanvas", label: "Full layout" },
]

export function getSidebarOpen(layout: SidebarLayout) {
  return layout === "default"
}

export function getSidebarCollapsible(
  layout: SidebarLayout,
): "icon" | "offcanvas" {
  return layout === "offcanvas" ? "offcanvas" : "icon"
}

function normalizeSidebarLayout(value: unknown): SidebarLayout {
  if (value === "default" || value === "icon" || value === "offcanvas") {
    return value
  }

  // Legacy values from the first implementation
  if (value === "compact") return "icon"
  if (value === "full") return "offcanvas"

  return defaultThemeConfig.sidebarLayout
}

export function readThemeConfig(): ThemeConfig {
  if (typeof window === "undefined") {
    return defaultThemeConfig
  }

  try {
    const stored = window.localStorage.getItem(THEME_CONFIG_STORAGE_KEY)
    if (!stored) {
      return defaultThemeConfig
    }

    const parsed = JSON.parse(stored) as Partial<
      ThemeConfig & { layout?: string }
    >

    return {
      themeColor: parsed.themeColor ?? defaultThemeConfig.themeColor,
      sidebarVariant:
        parsed.sidebarVariant ?? defaultThemeConfig.sidebarVariant,
      sidebarLayout: normalizeSidebarLayout(
        parsed.sidebarLayout ?? parsed.layout,
      ),
      direction:
        parsed.direction === "rtl" ? "rtl" : defaultThemeConfig.direction,
    }
  } catch {
    return defaultThemeConfig
  }
}

export function writeThemeConfig(config: ThemeConfig) {
  window.localStorage.setItem(THEME_CONFIG_STORAGE_KEY, JSON.stringify(config))
}
