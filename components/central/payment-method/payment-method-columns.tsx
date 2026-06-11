"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Building2Icon, TextIcon } from "lucide-react"
import * as React from "react"

import { PaymentMethodRowActions } from "@/components/central/payment-method/payment-method-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { getCardDisplayInfo } from "@/lib/central/payment/card-brand"
import type { PaymentMethod } from "@/types/central/payment-method"

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy HH:mm")
}

export function getPaymentMethodColumns(): ColumnDef<PaymentMethod>[] {
  return [
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<PaymentMethod, unknown> }) => (
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
      id: "brand",
      accessorFn: (row) => row.brand ?? "—",
      header: ({ column }: { column: Column<PaymentMethod, unknown> }) => (
        <DataTableColumnHeader column={column} label="Brand" />
      ),
      cell: ({ row }) => (
        <span className="capitalize">
          {getCardDisplayInfo(row.original.brand).label}
        </span>
      ),
    },
    {
      id: "last4",
      accessorFn: (row) => row.last4 ?? "—",
      header: ({ column }: { column: Column<PaymentMethod, unknown> }) => (
        <DataTableColumnHeader column={column} label="Card" />
      ),
      cell: ({ row }) => {
        const last4 = row.original.last4

        if (!last4) {
          return "—"
        }

        return <span className="font-mono text-sm">•••• {last4}</span>
      },
    },
    {
      id: "provider",
      accessorKey: "provider",
      header: ({ column }: { column: Column<PaymentMethod, unknown> }) => (
        <DataTableColumnHeader column={column} label="Provider" />
      ),
      cell: ({ cell }) => (
        <span className="capitalize">{String(cell.getValue())}</span>
      ),
    },
    {
      id: "is_default",
      accessorKey: "is_default",
      header: ({ column }: { column: Column<PaymentMethod, unknown> }) => (
        <DataTableColumnHeader column={column} label="Default" />
      ),
      cell: ({ cell }) =>
        cell.getValue<boolean>() ? (
          <Badge variant="outline">Default</Badge>
        ) : (
          "—"
        ),
    },
    {
      id: "provider_method_id",
      accessorKey: "provider_method_id",
      header: ({ column }: { column: Column<PaymentMethod, unknown> }) => (
        <DataTableColumnHeader column={column} label="Provider ID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.provider_method_id}</span>
      ),
      meta: {
        label: "Provider ID",
        placeholder: "Search payment methods...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }: { column: Column<PaymentMethod, unknown> }) => (
        <DataTableColumnHeader column={column} label="Saved" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
    },
    {
      id: "actions",
      cell: ({ row }) => <PaymentMethodRowActions method={row.original} />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
