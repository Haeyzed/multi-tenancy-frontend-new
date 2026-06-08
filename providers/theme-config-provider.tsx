"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { DirectionProvider } from "@/components/ui/direction"
import {
  defaultThemeConfig,
  readThemeConfig,
  type Direction,
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
  setDirection: (direction: Direction) => void
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

function applyDirection(direction: Direction) {
  document.documentElement.setAttribute("dir", direction)
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
    applyDirection(stored.direction)
  }, [])

  const persist = React.useCallback(
    (updater: (current: ThemeConfig) => ThemeConfig) => {
      setConfig((current) => {
        const next = updater(current)
        writeThemeConfig(next)
        applyThemeColor(next.themeColor)
        applyDirection(next.direction)
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

  const setDirection = React.useCallback(
    (direction: Direction) => {
      persist((current) => ({ ...current, direction }))
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
      setDirection,
      resetConfig,
    }),
    [
      config,
      setDirection,
      setSidebarLayout,
      setSidebarVariant,
      setThemeColor,
      resetConfig,
    ],
  )

  return (
    <ThemeConfigContext.Provider value={value}>
      <DirectionProvider direction={config.direction}>
        {children}
      </DirectionProvider>
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
