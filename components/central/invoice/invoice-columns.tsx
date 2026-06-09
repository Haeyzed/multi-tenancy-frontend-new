"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  AlertCircleIcon,
  BanIcon,
  Building2Icon,
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
  TextIcon,
} from "lucide-react"
import * as React from "react"

import { InvoiceRowActions } from "@/components/central/invoice/invoice-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { formatMoneyFromMinor } from "@/lib/central/billing/format-money"
import { invoiceStatusFilterOptions } from "@/lib/data-table/billing-filter-options"
import {
  InvoiceStatuses,
  invoiceStatusLabels,
  type Invoice,
  type InvoiceStatus,
} from "@/types/central/invoice"

const statusConfig: Record<
  InvoiceStatus,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  [InvoiceStatuses.Draft]: { label: invoiceStatusLabels.draft, icon: FileTextIcon },
  [InvoiceStatuses.Open]: { label: invoiceStatusLabels.open, icon: ClockIcon },
  [InvoiceStatuses.Paid]: { label: invoiceStatusLabels.paid, icon: CheckCircle2Icon },
  [InvoiceStatuses.Void]: { label: invoiceStatusLabels.void, icon: BanIcon },
  [InvoiceStatuses.Uncollectible]: {
    label: invoiceStatusLabels.uncollectible,
    icon: AlertCircleIcon,
  },
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

export function getInvoiceColumns(): ColumnDef<Invoice>[] {
  return [
    {
      id: "invoice_number",
      accessorKey: "invoice_number",
      header: ({ column }: { column: Column<Invoice, unknown> }) => (
        <DataTableColumnHeader column={column} label="Invoice" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium">
          <FileTextIcon className="size-4 text-muted-foreground" />
          {row.getValue("invoice_number")}
        </div>
      ),
      meta: {
        label: "Invoice",
        placeholder: "Search invoices...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<Invoice, unknown> }) => (
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
      id: "status",
      accessorKey: "status",
      header: ({ column }: { column: Column<Invoice, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<InvoiceStatus>()
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
        options: [...invoiceStatusFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "amount_due",
      accessorKey: "amount_due",
      header: ({ column }: { column: Column<Invoice, unknown> }) => (
        <DataTableColumnHeader column={column} label="Amount Due" />
      ),
      cell: ({ row }) =>
        formatMoneyFromMinor(row.original.amount_due, row.original.currency),
    },
    {
      id: "amount_remaining",
      accessorKey: "amount_remaining",
      header: ({ column }: { column: Column<Invoice, unknown> }) => (
        <DataTableColumnHeader column={column} label="Remaining" />
      ),
      cell: ({ row }) =>
        formatMoneyFromMinor(
          row.original.amount_remaining,
          row.original.currency,
        ),
    },
    {
      id: "due_date",
      accessorKey: "due_date",
      header: ({ column }: { column: Column<Invoice, unknown> }) => (
        <DataTableColumnHeader column={column} label="Due Date" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
    },
    {
      id: "paid_at",
      accessorKey: "paid_at",
      header: ({ column }: { column: Column<Invoice, unknown> }) => (
        <DataTableColumnHeader column={column} label="Paid" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
    },
    {
      id: "actions",
      cell: ({ row }) => <InvoiceRowActions invoice={row.original} />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
