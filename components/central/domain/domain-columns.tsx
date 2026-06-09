"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import {
  Building2Icon,
  GlobeIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  StarIcon,
  TextIcon,
} from "lucide-react"
import * as React from "react"

import { DomainRowActions } from "@/components/central/domain/domain-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { domainVerifiedFilterOptions } from "@/lib/data-table/tenant-ops-filter-options"
import type { Domain } from "@/types/central/domain"

interface DomainColumnsOptions {
  onEdit: (domain: Domain) => void
}

export function getDomainColumns({
  onEdit,
}: DomainColumnsOptions): ColumnDef<Domain>[] {
  return [
    {
      id: "domain",
      accessorKey: "domain",
      header: ({ column }: { column: Column<Domain, unknown> }) => (
        <DataTableColumnHeader column={column} label="Domain" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium">
          <GlobeIcon className="size-4 text-muted-foreground" />
          {row.getValue("domain")}
        </div>
      ),
      meta: {
        label: "Domain",
        placeholder: "Search domains...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<Domain, unknown> }) => (
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
      id: "verified",
      accessorFn: (row) => (row.verified ? "verified" : "unverified"),
      header: ({ column }: { column: Column<Domain, unknown> }) => (
        <DataTableColumnHeader column={column} label="Verification" />
      ),
      cell: ({ row }) => {
        const verified = row.original.verified

        return (
          <Badge variant={verified ? "default" : "secondary"}>
            {verified ? (
              <ShieldCheckIcon className="size-3" />
            ) : (
              <ShieldOffIcon className="size-3" />
            )}
            {verified ? "Verified" : "Unverified"}
          </Badge>
        )
      },
      meta: {
        label: "Verification",
        variant: "multiSelect",
        options: [...domainVerifiedFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "is_primary",
      accessorKey: "is_primary",
      header: ({ column }: { column: Column<Domain, unknown> }) => (
        <DataTableColumnHeader column={column} label="Primary" />
      ),
      cell: ({ row }) =>
        row.original.is_primary ? (
          <Badge variant="outline">
            <StarIcon className="size-3" />
            Primary
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "is_fallback",
      accessorKey: "is_fallback",
      header: ({ column }: { column: Column<Domain, unknown> }) => (
        <DataTableColumnHeader column={column} label="Fallback" />
      ),
      cell: ({ row }) =>
        row.original.is_fallback ? (
          <Badge variant="outline">Fallback</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DomainRowActions domain={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
