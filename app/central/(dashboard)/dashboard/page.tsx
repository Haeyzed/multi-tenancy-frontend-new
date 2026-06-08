import { DashboardPageContent } from "@/components/central/dashboard/dashboard-page-content"
import { PageHeader } from "@/components/layout/page-header"

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Platform overview with KPIs, trends, and recent activity."
      />
      <DashboardPageContent />
    </>
  )
}
