"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  BanIcon,
  Building2Icon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  TextIcon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"

import { PaymentRowActions } from "@/components/central/payment/payment-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { formatMoneyFromMinor } from "@/lib/central/billing/format-money"
import { getCardDisplayInfo } from "@/lib/central/payment/card-brand"
import { paymentStatusFilterOptions } from "@/lib/data-table/billing-filter-options"
import {
  PaymentStatuses,
  paymentStatusLabels,
  type Payment,
  type PaymentStatus,
} from "@/types/central/payment"

const statusConfig: Record<
  PaymentStatus,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  [PaymentStatuses.Pending]: {
    label: paymentStatusLabels.pending,
    icon: ClockIcon,
  },
  [PaymentStatuses.Succeeded]: {
    label: paymentStatusLabels.succeeded,
    icon: CheckCircle2Icon,
  },
  [PaymentStatuses.Failed]: {
    label: paymentStatusLabels.failed,
    icon: XCircleIcon,
  },
  [PaymentStatuses.Refunded]: {
    label: paymentStatusLabels.refunded,
    icon: BanIcon,
  },
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy HH:mm")
}

export function getPaymentColumns(): ColumnDef<Payment>[] {
  return [
    {
      id: "provider_payment_id",
      accessorFn: (row) => row.provider_payment_id ?? row.id,
      header: ({ column }: { column: Column<Payment, unknown> }) => (
        <DataTableColumnHeader column={column} label="Payment" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 font-medium">
            <CreditCardIcon className="size-4 text-muted-foreground" />
            <span className="font-mono text-xs">
              {row.original.provider_payment_id ?? row.original.id.slice(0, 8)}
            </span>
          </div>
          <span className="ps-5 text-xs capitalize text-muted-foreground">
            {row.original.payment_provider}
          </span>
        </div>
      ),
      meta: {
        label: "Payment",
        placeholder: "Search payments...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<Payment, unknown> }) => (
        <DataTableColumnHeader column={column} label="Tenant" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Building2Icon className="size-4 text-muted-foreground" />
          {row.original.tenant?.name ?? "—"}
        </div>
      ),
      enablePinning: true,
    },
    {
      id: "invoice",
      accessorFn: (row) => row.invoice?.invoice_number ?? "—",
      header: ({ column }: { column: Column<Payment, unknown> }) => (
        <DataTableColumnHeader column={column} label="Invoice" />
      ),
      cell: ({ row }) => {
        const invoice = row.original.invoice

        if (!invoice) {
          return "—"
        }

        return (
          <div className="flex items-center gap-1 text-sm">
            <FileTextIcon className="size-4 text-muted-foreground" />
            {invoice.invoice_number}
          </div>
        )
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }: { column: Column<Payment, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<PaymentStatus>()
        const config = statusConfig[status]
        const Icon = config.icon

        return (
          <Badge variant="outline" className="capitalize">
            <Icon />
            {config.label}
          </Badge>
        )
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...paymentStatusFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: ({ column }: { column: Column<Payment, unknown> }) => (
        <DataTableColumnHeader column={column} label="Amount" />
      ),
      cell: ({ row }) =>
        formatMoneyFromMinor(row.original.amount, row.original.currency),
    },
    {
      id: "payment_method_last4",
      accessorFn: (row) => row.payment_method_last4 ?? "—",
      header: ({ column }: { column: Column<Payment, unknown> }) => (
        <DataTableColumnHeader column={column} label="Method" />
      ),
      cell: ({ row }) => {
        const last4 = row.original.payment_method_last4
        const brand = row.original.payment_method_brand
        const type = row.original.payment_method_type

        if (!last4 && !type && !brand) {
          return "—"
        }

        const brandInfo = getCardDisplayInfo(brand)

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium capitalize">
              {brandInfo.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {type ? `${type} ` : ""}
              {last4 ? `•••• ${last4}` : ""}
            </span>
          </div>
        )
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }: { column: Column<Payment, unknown> }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
    },
    {
      id: "actions",
      cell: ({ row }) => <PaymentRowActions payment={row.original} />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
