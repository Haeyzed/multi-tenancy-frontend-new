"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  ActivityIcon,
  Building2Icon,
  ClockIcon,
  TextIcon,
} from "lucide-react"
import * as React from "react"

import { UsageRecordRowActions } from "@/components/central/usage-record/usage-record-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { usageMetricFilterOptions } from "@/lib/data-table/usage-filter-options"
import {
  usageMetricLabels,
  type UsageMetric,
  type UsageRecord,
} from "@/types/central/usage-record"

interface UsageRecordColumnsOptions {
  onEdit: (record: UsageRecord) => void
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy HH:mm")
}

function formatQuantity(value: string | number) {
  const numeric = typeof value === "string" ? Number(value) : value

  if (Number.isNaN(numeric)) {
    return String(value)
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(numeric)
}

function getMetricLabel(metric: string) {
  return usageMetricLabels[metric as UsageMetric] ?? metric
}

export function getUsageRecordColumns({
  onEdit,
}: UsageRecordColumnsOptions): ColumnDef<UsageRecord>[] {
  return [
    {
      id: "search",
      accessorFn: (row) => getMetricLabel(String(row.metric)),
      header: ({ column }: { column: Column<UsageRecord, unknown> }) => (
        <DataTableColumnHeader column={column} label="Metric" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium">
          <ActivityIcon className="size-4 text-muted-foreground" />
          {getMetricLabel(String(row.original.metric))}
        </div>
      ),
      meta: {
        label: "Search",
        placeholder: "Search usage records...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "metric",
      accessorKey: "metric",
      header: ({ column }: { column: Column<UsageRecord, unknown> }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{getMetricLabel(String(row.original.metric))}</Badge>
      ),
      meta: {
        label: "Metric",
        variant: "multiSelect",
        options: [...usageMetricFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<UsageRecord, unknown> }) => (
        <DataTableColumnHeader column={column} label="Tenant" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Building2Icon className="size-4 text-muted-foreground" />
          {row.original.tenant?.name ?? "—"}
        </div>
      ),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: ({ column }: { column: Column<UsageRecord, unknown> }) => (
        <DataTableColumnHeader column={column} label="Quantity" />
      ),
      cell: ({ row }) => formatQuantity(row.original.quantity),
    },
    {
      id: "recorded_at",
      accessorKey: "recorded_at",
      header: ({ column }: { column: Column<UsageRecord, unknown> }) => (
        <DataTableColumnHeader column={column} label="Recorded" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <ClockIcon className="size-4" />
          {formatDate(row.original.recorded_at)}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <UsageRecordRowActions record={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
