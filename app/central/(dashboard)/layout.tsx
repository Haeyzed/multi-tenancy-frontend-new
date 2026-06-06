import { AuthGuard } from "@/components/central/auth-guard"
import { DashboardShell } from "@/components/central/dashboard-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  )
}
