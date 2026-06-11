import { AuthGuard } from "@/components/central/auth-guard"
import { DashboardShell } from "@/components/central/dashboard-shell"
import { PermissionGuard } from "@/components/central/permission-guard"
import { CentralBroadcastProvider } from "@/providers/central/central-broadcast-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <CentralBroadcastProvider>
        <DashboardShell>
          <PermissionGuard>{children}</PermissionGuard>
        </DashboardShell>
      </CentralBroadcastProvider>
    </AuthGuard>
  )
}
