"use client"

import { AuthShell } from "@/components/central/auth/auth-shell"

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthShell contentClassName="max-w-2xl">{children}</AuthShell>
}
