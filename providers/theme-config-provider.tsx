"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  defaultThemeConfig,
  readThemeConfig,
  type SidebarLayout,
  type SidebarVariant,
  type ThemeColor,
  type ThemeConfig,
  writeThemeConfig,
} from "@/lib/theme-config"

type ThemeConfigContextValue = {
  config: ThemeConfig
  setThemeColor: (themeColor: ThemeColor) => void
  setSidebarVariant: (sidebarVariant: SidebarVariant) => void
  setSidebarLayout: (sidebarLayout: SidebarLayout) => void
  resetConfig: () => void
}

const ThemeConfigContext = React.createContext<ThemeConfigContextValue | null>(
  null,
)

function applyThemeColor(themeColor: ThemeColor) {
  if (themeColor === "green") {
    delete document.documentElement.dataset.themeColor
    return
  }

  document.documentElement.dataset.themeColor = themeColor
}

export function ThemeConfigProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme } = useTheme()
  const [config, setConfig] = React.useState<ThemeConfig>(defaultThemeConfig)

  React.useEffect(() => {
    const stored = readThemeConfig()
    setConfig(stored)
    applyThemeColor(stored.themeColor)
  }, [])

  const persist = React.useCallback(
    (updater: (current: ThemeConfig) => ThemeConfig) => {
      setConfig((current) => {
        const next = updater(current)
        writeThemeConfig(next)
        applyThemeColor(next.themeColor)
        return next
      })
    },
    [],
  )

  const setThemeColor = React.useCallback(
    (themeColor: ThemeColor) => {
      persist((current) => ({ ...current, themeColor }))
    },
    [persist],
  )

  const setSidebarVariant = React.useCallback(
    (sidebarVariant: SidebarVariant) => {
      persist((current) => ({ ...current, sidebarVariant }))
    },
    [persist],
  )

  const setSidebarLayout = React.useCallback(
    (sidebarLayout: SidebarLayout) => {
      persist((current) => ({ ...current, sidebarLayout }))
    },
    [persist],
  )

  const resetConfig = React.useCallback(() => {
    setTheme("system")
    persist(() => defaultThemeConfig)
  }, [persist, setTheme])

  const value = React.useMemo(
    () => ({
      config,
      setThemeColor,
      setSidebarVariant,
      setSidebarLayout,
      resetConfig,
    }),
    [config, setSidebarLayout, setSidebarVariant, setThemeColor, resetConfig],
  )

  return (
    <ThemeConfigContext.Provider value={value}>
      {children}
    </ThemeConfigContext.Provider>
  )
}

export function useThemeConfig() {
  const context = React.useContext(ThemeConfigContext)
  if (!context) {
    throw new Error("useThemeConfig must be used within ThemeConfigProvider.")
  }

  return context
}
