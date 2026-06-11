import { TenantDashboardPageContent } from "@/components/tenant/dashboard/dashboard-page-content"
import { PageHeader } from "@/components/layout/page-header"

export default function TenantDashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Store overview and key configuration at a glance."
      />
      <TenantDashboardPageContent />
    </>
  )
}
