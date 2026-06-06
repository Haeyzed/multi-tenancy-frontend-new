import { PageBreadcrumb } from "@/components/central/page-breadcrumb"
import { SubscriptionMetricCards } from "@/components/central/subscription/subscription-metric-cards"
import { SubscriptionsDataTable } from "@/components/central/subscription/subscriptions-data-table"

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Subscriptions" },
          ]}
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">
            Monitor tenant subscriptions, billing cycles, and lifecycle status.
          </p>
        </div>
      </div>

      <SubscriptionMetricCards />

      <SubscriptionsDataTable />
    </div>
  )
}
