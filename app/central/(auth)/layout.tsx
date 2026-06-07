"use client"

import { usePathname } from "next/navigation"

import { AuthShell } from "@/components/central/auth/auth-shell"

export default function CentralAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isSignupFlow = pathname?.startsWith("/central/signup") ?? false

  return (
    <AuthShell contentClassName={isSignupFlow ? "max-w-2xl" : undefined}>
      {children}
    </AuthShell>
  )
}
