import { DashboardPageContent } from "@/components/central/dashboard/dashboard-page-content"
import { PageBreadcrumb } from "@/components/central/page-breadcrumb"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Dashboard" },
          ]}
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform overview with KPIs, trends, and recent activity.
          </p>
        </div>
      </div>

      <DashboardPageContent />
    </div>
  )
}
