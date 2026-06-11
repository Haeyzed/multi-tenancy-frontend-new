import { TenantAuthGuard } from "@/components/tenant/auth-guard"
import { TenantDashboardShell } from "@/components/tenant/dashboard-shell"
import { TenantPermissionGuard } from "@/components/tenant/permission-guard"

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TenantAuthGuard>
      <TenantDashboardShell>
        <TenantPermissionGuard>{children}</TenantPermissionGuard>
      </TenantDashboardShell>
    </TenantAuthGuard>
  )
}
