"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  ActivityIcon,
  Building2Icon,
  CalendarIcon,
  TextIcon,
} from "lucide-react"
import * as React from "react"

import { TenantMetricRowActions } from "@/components/central/tenant-metric/tenant-metric-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { TenantMetric } from "@/types/central/tenant-metric"

interface TenantMetricColumnsOptions {
  onEdit: (metric: TenantMetric) => void
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

function formatNumber(value: number | string) {
  const numeric = typeof value === "string" ? Number(value) : value

  if (Number.isNaN(numeric)) {
    return String(value)
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(numeric)
}

export function getTenantMetricColumns({
  onEdit,
}: TenantMetricColumnsOptions): ColumnDef<TenantMetric>[] {
  return [
    {
      id: "search",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<TenantMetric, unknown> }) => (
        <DataTableColumnHeader column={column} label="Tenant" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium">
          <Building2Icon className="size-4 text-muted-foreground" />
          {row.original.tenant?.name ?? "—"}
        </div>
      ),
      meta: {
        label: "Search",
        placeholder: "Search tenant metrics...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "metric_date",
      accessorKey: "metric_date",
      header: ({ column }: { column: Column<TenantMetric, unknown> }) => (
        <DataTableColumnHeader column={column} label="Date" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <CalendarIcon className="size-4" />
          {formatDate(row.original.metric_date)}
        </div>
      ),
    },
    {
      id: "total_orders",
      accessorKey: "total_orders",
      header: ({ column }: { column: Column<TenantMetric, unknown> }) => (
        <DataTableColumnHeader column={column} label="Orders" />
      ),
      cell: ({ row }) => formatNumber(row.original.total_orders),
    },
    {
      id: "total_revenue",
      accessorKey: "total_revenue",
      header: ({ column }: { column: Column<TenantMetric, unknown> }) => (
        <DataTableColumnHeader column={column} label="Revenue" />
      ),
      cell: ({ row }) => formatNumber(row.original.total_revenue),
    },
    {
      id: "api_calls",
      accessorKey: "api_calls",
      header: ({ column }: { column: Column<TenantMetric, unknown> }) => (
        <DataTableColumnHeader column={column} label="API calls" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <ActivityIcon className="size-4 text-muted-foreground" />
          {formatNumber(row.original.api_calls)}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <TenantMetricRowActions metric={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
