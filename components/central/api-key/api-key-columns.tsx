"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  Building2Icon,
  ClockIcon,
  KeyIcon,
  TextIcon,
} from "lucide-react"
import * as React from "react"

import { ApiKeyRowActions } from "@/components/central/api-key/api-key-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { apiKeyStatusFilterOptions } from "@/lib/data-table/monitoring-filter-options"
import type { ApiKey } from "@/types/central/api-key"

interface ApiKeyColumnsOptions {
  onEdit: (apiKey: ApiKey) => void
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

function isExpired(apiKey: ApiKey) {
  if (!apiKey.expires_at || !apiKey.is_active) {
    return false
  }

  return new Date(apiKey.expires_at) < new Date()
}

export function getApiKeyColumns({
  onEdit,
}: ApiKeyColumnsOptions): ColumnDef<ApiKey>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }: { column: Column<ApiKey, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium">
          <KeyIcon className="size-4 text-muted-foreground" />
          {row.getValue("name")}
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search API keys...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<ApiKey, unknown> }) => (
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
      id: "is_active",
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      header: ({ column }: { column: Column<ApiKey, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const expired = isExpired(row.original)

        if (expired) {
          return <Badge variant="destructive">Expired</Badge>
        }

        return (
          <Badge variant={row.original.is_active ? "default" : "secondary"}>
            {row.original.is_active ? "Active" : "Revoked"}
          </Badge>
        )
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...apiKeyStatusFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "last_used_at",
      accessorKey: "last_used_at",
      header: ({ column }: { column: Column<ApiKey, unknown> }) => (
        <DataTableColumnHeader column={column} label="Last used" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <ClockIcon className="size-4" />
          {formatDate(row.original.last_used_at)}
        </div>
      ),
    },
    {
      id: "expires_at",
      accessorKey: "expires_at",
      header: ({ column }: { column: Column<ApiKey, unknown> }) => (
        <DataTableColumnHeader column={column} label="Expires" />
      ),
      cell: ({ row }) => formatDate(row.original.expires_at),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ApiKeyRowActions apiKey={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
