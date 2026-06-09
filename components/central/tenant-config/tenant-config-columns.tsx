"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { Building2Icon, KeyIcon, LockIcon, TextIcon } from "lucide-react"
import * as React from "react"

import { TenantConfigRowActions } from "@/components/central/tenant-config/tenant-config-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import type { TenantConfig } from "@/types/central/tenant-config"

interface TenantConfigColumnsOptions {
  onEdit: (config: TenantConfig) => void
}

export function getTenantConfigColumns({
  onEdit,
}: TenantConfigColumnsOptions): ColumnDef<TenantConfig>[] {
  return [
    {
      id: "key",
      accessorKey: "key",
      header: ({ column }: { column: Column<TenantConfig, unknown> }) => (
        <DataTableColumnHeader column={column} label="Key" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium">
          <KeyIcon className="size-4 text-muted-foreground" />
          {row.getValue("key")}
        </div>
      ),
      meta: {
        label: "Key",
        placeholder: "Search configs...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<TenantConfig, unknown> }) => (
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
      id: "value",
      accessorKey: "value",
      header: ({ column }: { column: Column<TenantConfig, unknown> }) => (
        <DataTableColumnHeader column={column} label="Value" />
      ),
      cell: ({ row }) => {
        const value = row.original.value

        if (row.original.encrypted) {
          return (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <LockIcon className="size-3.5" />
              Encrypted
            </span>
          )
        }

        return (
          <span className="max-w-[280px] truncate" title={value ?? undefined}>
            {value ?? "—"}
          </span>
        )
      },
    },
    {
      id: "encrypted",
      accessorKey: "encrypted",
      header: ({ column }: { column: Column<TenantConfig, unknown> }) => (
        <DataTableColumnHeader column={column} label="Encrypted" />
      ),
      cell: ({ row }) =>
        row.original.encrypted ? (
          <Badge variant="outline">Yes</Badge>
        ) : (
          <span className="text-muted-foreground">No</span>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <TenantConfigRowActions config={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
