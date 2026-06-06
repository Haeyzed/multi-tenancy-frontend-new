import { PageBreadcrumb } from "@/components/central/page-breadcrumb"
import { TenantMetricCards } from "@/components/central/tenant/tenant-metric-cards"
import { TenantsDataTable } from "@/components/central/tenant/tenants-data-table"

export default function TenantsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Tenants" },
          ]}
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
          <p className="text-sm text-muted-foreground">
            Manage platform tenants, subscriptions, and lifecycle status.
          </p>
        </div>
      </div>

      <TenantMetricCards />

      <TenantsDataTable />
    </div>
  )
}
