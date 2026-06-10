"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  ActivityIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  Building2Icon,
  CheckCircle2Icon,
  HelpCircleIcon,
  TextIcon,
} from "lucide-react"
import * as React from "react"

import { HealthCheckRowActions } from "@/components/central/health-check/health-check-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { healthCheckStatusFilterOptions } from "@/lib/data-table/monitoring-filter-options"
import {
  HealthCheckStatuses,
  healthCheckStatusLabels,
  healthCheckTypeLabels,
  type HealthCheck,
  type HealthCheckStatus,
  type HealthCheckType,
} from "@/types/central/health-check"

const statusConfig: Record<
  HealthCheckStatus,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  [HealthCheckStatuses.Healthy]: {
    label: healthCheckStatusLabels.healthy,
    icon: CheckCircle2Icon,
  },
  [HealthCheckStatuses.Warning]: {
    label: healthCheckStatusLabels.warning,
    icon: AlertTriangleIcon,
  },
  [HealthCheckStatuses.Critical]: {
    label: healthCheckStatusLabels.critical,
    icon: AlertCircleIcon,
  },
  [HealthCheckStatuses.Unknown]: {
    label: healthCheckStatusLabels.unknown,
    icon: HelpCircleIcon,
  },
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy HH:mm")
}

export function getHealthCheckColumns(): ColumnDef<HealthCheck>[] {
  return [
    {
      id: "check_type",
      accessorKey: "check_type",
      header: ({ column }: { column: Column<HealthCheck, unknown> }) => (
        <DataTableColumnHeader column={column} label="Check" />
      ),
      cell: ({ row }) => {
        const type = row.original.check_type as HealthCheckType

        return (
          <div className="flex items-center gap-1 font-medium">
            <ActivityIcon className="size-4 text-muted-foreground" />
            {healthCheckTypeLabels[type] ?? type}
          </div>
        )
      },
      meta: {
        label: "Check",
        placeholder: "Search health checks...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<HealthCheck, unknown> }) => (
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
      id: "status",
      accessorKey: "status",
      header: ({ column }: { column: Column<HealthCheck, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status as HealthCheckStatus
        const config = statusConfig[status]

        return (
          <Badge variant={status === HealthCheckStatuses.Healthy ? "default" : "secondary"}>
            {config ? <config.icon className="size-3" /> : null}
            {config?.label ?? status}
          </Badge>
        )
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...healthCheckStatusFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "response_time_ms",
      accessorKey: "response_time_ms",
      header: ({ column }: { column: Column<HealthCheck, unknown> }) => (
        <DataTableColumnHeader column={column} label="Response" />
      ),
      cell: ({ row }) =>
        row.original.response_time_ms != null
          ? `${row.original.response_time_ms} ms`
          : "—",
    },
    {
      id: "checked_at",
      accessorKey: "checked_at",
      header: ({ column }: { column: Column<HealthCheck, unknown> }) => (
        <DataTableColumnHeader column={column} label="Checked" />
      ),
      cell: ({ row }) => formatDate(row.original.checked_at),
    },
    {
      id: "actions",
      cell: ({ row }) => <HealthCheckRowActions healthCheck={row.original} />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
