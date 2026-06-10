"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  Building2Icon,
  ClockIcon,
  TextIcon,
  UserIcon,
} from "lucide-react"
import * as React from "react"

import { ImpersonationTokenRowActions } from "@/components/central/impersonation-token/impersonation-token-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { impersonationTokenStatusFilterOptions } from "@/lib/data-table/impersonation-filter-options"
import type { ImpersonationToken } from "@/types/central/impersonation-token"

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy HH:mm")
}

function getTokenStatus(token: ImpersonationToken) {
  if (token.used_at) {
    return "used" as const
  }

  if (new Date(token.expires_at) <= new Date()) {
    return "expired" as const
  }

  return "valid" as const
}

export function getImpersonationTokenColumns(): ColumnDef<ImpersonationToken>[] {
  return [
    {
      id: "search",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<ImpersonationToken, unknown> }) => (
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
        placeholder: "Search impersonation tokens...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "administrator",
      accessorFn: (row) => row.administrator?.name ?? "—",
      header: ({ column }: { column: Column<ImpersonationToken, unknown> }) => (
        <DataTableColumnHeader column={column} label="Issued by" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <UserIcon className="size-4 text-muted-foreground" />
          {row.original.administrator?.name ?? "—"}
        </div>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => getTokenStatus(row),
      header: ({ column }: { column: Column<ImpersonationToken, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const status = getTokenStatus(row.original)

        if (status === "valid") {
          return <Badge variant="default">Valid</Badge>
        }

        if (status === "used") {
          return <Badge variant="secondary">Used</Badge>
        }

        return <Badge variant="destructive">Expired</Badge>
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...impersonationTokenStatusFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "expires_at",
      accessorKey: "expires_at",
      header: ({ column }: { column: Column<ImpersonationToken, unknown> }) => (
        <DataTableColumnHeader column={column} label="Expires" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <ClockIcon className="size-4" />
          {formatDate(row.original.expires_at)}
        </div>
      ),
    },
    {
      id: "used_at",
      accessorKey: "used_at",
      header: ({ column }: { column: Column<ImpersonationToken, unknown> }) => (
        <DataTableColumnHeader column={column} label="Used" />
      ),
      cell: ({ row }) => formatDate(row.original.used_at),
    },
    {
      id: "actions",
      cell: ({ row }) => <ImpersonationTokenRowActions token={row.original} />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export { getTokenStatus, formatDate as formatImpersonationTokenDate }
