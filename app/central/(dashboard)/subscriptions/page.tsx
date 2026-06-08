import { SubscriptionMetricCards } from "@/components/central/subscription/subscription-metric-cards"
import { SubscriptionsDataTable } from "@/components/central/subscription/subscriptions-data-table"
import { PageHeader } from "@/components/layout/page-header"

export default function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Monitor tenant subscriptions, billing cycles, and lifecycle status."
      />
      <SubscriptionMetricCards />
      <SubscriptionsDataTable />
    </>
  )
}
