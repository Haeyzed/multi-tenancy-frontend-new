import { AuthGuard } from "@/components/central/auth-guard"
import { DashboardShell } from "@/components/central/dashboard-shell"
import { PermissionGuard } from "@/components/central/permission-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <DashboardShell>
        <PermissionGuard>{children}</PermissionGuard>
      </DashboardShell>
    </AuthGuard>
  )
}
