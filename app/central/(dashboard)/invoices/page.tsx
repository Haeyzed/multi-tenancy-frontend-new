import { InvoiceMetricCards } from "@/components/central/invoice/invoice-metric-cards"
import { InvoicesDataTable } from "@/components/central/invoice/invoices-data-table"
import { PageHeader } from "@/components/layout/page-header"

export default function InvoicesPage() {
  return (
    <>
      <PageHeader
        title="Invoices"
        description="Review tenant billing invoices, outstanding balances, and payment status."
      />
      <InvoiceMetricCards />
      <InvoicesDataTable />
    </>
  )
}
