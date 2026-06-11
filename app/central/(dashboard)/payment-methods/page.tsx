import { PaymentMethodsDataTable } from "@/components/central/payment-method/payment-methods-data-table"
import { PageHeader } from "@/components/layout/page-header"

export default function PaymentMethodsPage() {
  return (
    <>
      <PageHeader
        title="Payment methods"
        description="Saved cards from Paystack and Stripe onboarding, including Visa, Mastercard, and Verve."
      />
      <PaymentMethodsDataTable />
    </>
  )
}
