"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { HistoryIcon, TextIcon, UserIcon } from "lucide-react"
import * as React from "react"

import { ActivityLogRowActions } from "@/components/central/activity-log/activity-log-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { activityEventFilterOptions } from "@/lib/data-table/platform-filter-options"
import type { ActivityLogEntry } from "@/types/central/activity-log"

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy HH:mm")
}

function shortClassName(value: string | null) {
  if (!value) {
    return "—"
  }

  const parts = value.split("\\")

  return parts[parts.length - 1] ?? value
}

export function getActivityLogColumns(): ColumnDef<ActivityLogEntry>[] {
  return [
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }: { column: Column<ActivityLogEntry, unknown> }) => (
        <DataTableColumnHeader column={column} label="Activity" />
      ),
      cell: ({ row }) => (
        <div className="flex max-w-[320px] items-start gap-1">
          <HistoryIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="truncate" title={row.original.description}>
            {row.original.description}
          </span>
        </div>
      ),
      meta: {
        label: "Activity",
        placeholder: "Search activity log...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "event",
      accessorKey: "event",
      header: ({ column }: { column: Column<ActivityLogEntry, unknown> }) => (
        <DataTableColumnHeader column={column} label="Event" />
      ),
      cell: ({ row }) =>
        row.original.event ? (
          <Badge variant="outline" className="capitalize">
            {row.original.event}
          </Badge>
        ) : (
          "—"
        ),
      meta: {
        label: "Event",
        variant: "multiSelect",
        options: [...activityEventFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "log_name",
      accessorKey: "log_name",
      header: ({ column }: { column: Column<ActivityLogEntry, unknown> }) => (
        <DataTableColumnHeader column={column} label="Log" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.log_name ?? "—"}</span>
      ),
    },
    {
      id: "subject_type",
      accessorFn: (row) => shortClassName(row.subject_type),
      header: ({ column }: { column: Column<ActivityLogEntry, unknown> }) => (
        <DataTableColumnHeader column={column} label="Subject" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">
          {shortClassName(row.original.subject_type)}
          {row.original.subject_id != null ? ` #${row.original.subject_id}` : ""}
        </span>
      ),
    },
    {
      id: "causer",
      accessorFn: (row) => row.causer?.name ?? "—",
      header: ({ column }: { column: Column<ActivityLogEntry, unknown> }) => (
        <DataTableColumnHeader column={column} label="Actor" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <UserIcon className="size-4 text-muted-foreground" />
          {row.original.causer?.name ?? "System"}
        </div>
      ),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }: { column: Column<ActivityLogEntry, unknown> }) => (
        <DataTableColumnHeader column={column} label="When" />
      ),
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActivityLogRowActions entry={row.original} />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
