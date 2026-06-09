import { PaymentMetricCards } from "@/components/central/payment/payment-metric-cards"
import { PaymentsDataTable } from "@/components/central/payment/payments-data-table"
import { PageHeader } from "@/components/layout/page-header"

export default function PaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Track payment transactions, refunds, and collection activity across tenants."
      />
      <PaymentMetricCards />
      <PaymentsDataTable />
    </>
  )
}
