"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  Building2Icon,
  BugIcon,
  CheckCircle2Icon,
  InfoIcon,
  TextIcon,
} from "lucide-react"
import * as React from "react"

import { ErrorLogRowActions } from "@/components/central/error-log/error-log-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import {
  errorLogResolutionFilterOptions,
  errorLogSeverityFilterOptions,
} from "@/lib/data-table/monitoring-filter-options"
import {
  ErrorLogSeverities,
  errorLogSeverityLabels,
  type ErrorLog,
  type ErrorLogSeverity,
} from "@/types/central/error-log"

const severityConfig: Record<
  ErrorLogSeverity,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  [ErrorLogSeverities.Debug]: { label: errorLogSeverityLabels.debug, icon: BugIcon },
  [ErrorLogSeverities.Info]: { label: errorLogSeverityLabels.info, icon: InfoIcon },
  [ErrorLogSeverities.Warning]: {
    label: errorLogSeverityLabels.warning,
    icon: AlertTriangleIcon,
  },
  [ErrorLogSeverities.Error]: {
    label: errorLogSeverityLabels.error,
    icon: AlertCircleIcon,
  },
  [ErrorLogSeverities.Critical]: {
    label: errorLogSeverityLabels.critical,
    icon: AlertCircleIcon,
  },
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy HH:mm")
}

export function getErrorLogColumns(): ColumnDef<ErrorLog>[] {
  return [
    {
      id: "message",
      accessorKey: "message",
      header: ({ column }: { column: Column<ErrorLog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Message" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[320px] truncate font-medium" title={row.original.message}>
          {row.original.message}
        </div>
      ),
      meta: {
        label: "Message",
        placeholder: "Search error logs...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "severity",
      accessorKey: "severity",
      header: ({ column }: { column: Column<ErrorLog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Severity" />
      ),
      cell: ({ row }) => {
        const severity = row.original.severity as ErrorLogSeverity
        const config = severityConfig[severity]

        return (
          <Badge
            variant={
              severity === ErrorLogSeverities.Critical ||
              severity === ErrorLogSeverities.Error
                ? "destructive"
                : "secondary"
            }
          >
            {config ? <config.icon className="size-3" /> : null}
            {config?.label ?? severity}
          </Badge>
        )
      },
      meta: {
        label: "Severity",
        variant: "multiSelect",
        options: [...errorLogSeverityFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "resolution",
      accessorFn: (row) => (row.resolved_at ? "resolved" : "unresolved"),
      header: ({ column }: { column: Column<ErrorLog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Resolution" />
      ),
      cell: ({ row }) =>
        row.original.resolved_at ? (
          <Badge variant="outline">
            <CheckCircle2Icon className="size-3" />
            Resolved
          </Badge>
        ) : (
          <Badge variant="secondary">Unresolved</Badge>
        ),
      meta: {
        label: "Resolution",
        variant: "multiSelect",
        options: [...errorLogResolutionFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "Platform",
      header: ({ column }: { column: Column<ErrorLog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Tenant" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Building2Icon className="size-4 text-muted-foreground" />
          {row.original.tenant?.name ?? "Platform"}
        </div>
      ),
    },
    {
      id: "channel",
      accessorKey: "channel",
      header: ({ column }: { column: Column<ErrorLog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Channel" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.channel}</span>
      ),
    },
    {
      id: "occurred_at",
      accessorKey: "occurred_at",
      header: ({ column }: { column: Column<ErrorLog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Occurred" />
      ),
      cell: ({ row }) => formatDate(row.original.occurred_at),
    },
    {
      id: "actions",
      cell: ({ row }) => <ErrorLogRowActions errorLog={row.original} />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
