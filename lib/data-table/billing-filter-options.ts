import {
  AlertCircle,
  Ban,
  CheckCircle,
  CircleDashed,
  Clock,
  FileText,
  PauseCircle,
  Sparkles,
  XCircle,
} from "lucide-react"

import {
  InvoiceStatuses,
  invoiceStatusLabels,
} from "@/types/central/invoice"
import {
  PaymentStatuses,
  paymentStatusLabels,
} from "@/types/central/payment"
import {
  SubscriptionStatuses,
  subscriptionStatusLabels,
} from "@/types/central/subscription"

export const invoiceStatusFilterOptions = Object.values(InvoiceStatuses).map(
  (value) => ({
    label: invoiceStatusLabels[value],
    value,
    icon:
      value === InvoiceStatuses.Paid
        ? CheckCircle
        : value === InvoiceStatuses.Open
          ? Clock
          : value === InvoiceStatuses.Void
            ? Ban
            : value === InvoiceStatuses.Uncollectible
              ? AlertCircle
              : FileText,
  }),
)

export const paymentStatusFilterOptions = Object.values(PaymentStatuses).map(
  (value) => ({
    label: paymentStatusLabels[value],
    value,
    icon:
      value === PaymentStatuses.Succeeded
        ? CheckCircle
        : value === PaymentStatuses.Pending
          ? Clock
          : value === PaymentStatuses.Failed
            ? XCircle
            : Ban,
  }),
)

export const subscriptionStatusFilterOptions = Object.values(
  SubscriptionStatuses,
).map((value) => ({
  label: subscriptionStatusLabels[value],
  value,
  icon:
    value === SubscriptionStatuses.Active
      ? CheckCircle
      : value === SubscriptionStatuses.Trialing
        ? Sparkles
        : value === SubscriptionStatuses.PastDue
          ? AlertCircle
          : value === SubscriptionStatuses.Cancelled
            ? Ban
            : value === SubscriptionStatuses.Paused
              ? PauseCircle
              : CircleDashed,
}))
