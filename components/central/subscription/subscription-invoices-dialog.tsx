"use client"

import { format } from "date-fns"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Subscription, SubscriptionInvoice } from "@/types/central/subscription"

interface SubscriptionInvoicesDialogProps {
  subscription: Subscription
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function InvoiceStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  )
}

function InvoicesTable({ invoices }: { invoices: SubscriptionInvoice[] }) {
  if (invoices.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No invoices found for this subscription.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Amount Due</TableHead>
          <TableHead className="text-end">Amount Paid</TableHead>
          <TableHead className="text-end">Remaining</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Paid At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
            <TableCell>
              <InvoiceStatusBadge status={invoice.status} />
            </TableCell>
            <TableCell className="text-end tabular-nums">
              {formatAmount(invoice.amount_due, invoice.currency)}
            </TableCell>
            <TableCell className="text-end tabular-nums">
              {formatAmount(invoice.amount_paid, invoice.currency)}
            </TableCell>
            <TableCell className="text-end tabular-nums">
              {formatAmount(invoice.amount_remaining, invoice.currency)}
            </TableCell>
            <TableCell>{formatDate(invoice.due_date)}</TableCell>
            <TableCell>{formatDate(invoice.paid_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function SubscriptionInvoicesDialog({
  subscription,
  open,
  onOpenChange,
}: SubscriptionInvoicesDialogProps) {
  const invoices = subscription.invoices ?? []
  const tenantName = subscription.tenant?.name ?? "Unknown tenant"
  const planName = subscription.plan?.name ?? "Unknown plan"

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-w-4xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Invoices</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {tenantName} · {planName} · {invoices.length}{" "}
            {invoices.length === 1 ? "invoice" : "invoices"}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <InvoicesTable invoices={invoices} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
