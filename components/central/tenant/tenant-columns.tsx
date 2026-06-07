"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import {
  BanIcon,
  CheckCircle2Icon,
  ClockIcon,
  GlobeIcon,
  MailIcon,
  PauseCircleIcon,
  TextIcon,
  UserIcon,
} from "lucide-react"
import * as React from "react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TenantRowActions } from "@/components/central/tenant/tenant-row-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { TenantStatuses, type Tenant, type TenantStatus } from "@/types/central/tenant"

const statusConfig: Record<
  TenantStatus,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  [TenantStatuses.Active]: { label: "Active", icon: CheckCircle2Icon },
  [TenantStatuses.Pending]: { label: "Pending", icon: ClockIcon },
  [TenantStatuses.Suspended]: { label: "Suspended", icon: PauseCircleIcon },
  [TenantStatuses.Cancelled]: { label: "Cancelled", icon: BanIcon },
}

export function getTenantColumns(): ColumnDef<Tenant>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }: { column: Column<Tenant, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search tenants...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "slug",
      accessorKey: "slug",
      header: ({ column }: { column: Column<Tenant, unknown> }) => (
        <DataTableColumnHeader column={column} label="Slug" />
      ),
      cell: ({ cell }) => (
        <span className="font-mono text-muted-foreground">
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      id: "domain",
      accessorKey: "domain",
      header: ({ column }: { column: Column<Tenant, unknown> }) => (
        <DataTableColumnHeader column={column} label="Domain" />
      ),
      cell: ({ cell }) => (
        <div className="flex items-center gap-1">
          <GlobeIcon className="size-4 text-muted-foreground" />
          {cell.getValue<string>()}
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }: { column: Column<Tenant, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<TenantStatus>()
        const config = statusConfig[status]
        const Icon = config.icon

        return (
          <Badge variant="outline" className="capitalize">
            <Icon />
            {config.label}
          </Badge>
        )
      },
    },
    {
      id: "owner_name",
      accessorKey: "owner_name",
      header: ({ column }: { column: Column<Tenant, unknown> }) => (
        <DataTableColumnHeader column={column} label="Owner" />
      ),
      cell: ({ cell }) => (
        <div className="flex items-center gap-1">
          <UserIcon className="size-4 text-muted-foreground" />
          {cell.getValue<string>()}
        </div>
      ),
    },
    {
      id: "owner_email",
      accessorKey: "owner_email",
      header: ({ column }: { column: Column<Tenant, unknown> }) => (
        <DataTableColumnHeader column={column} label="Owner Email" />
      ),
      cell: ({ cell }) => (
        <div className="flex items-center gap-1">
          <MailIcon className="size-4 text-muted-foreground" />
          {cell.getValue<string>()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <TenantRowActions tenant={row.original} />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function useTenantColumns() {
  return React.useMemo(() => getTenantColumns(), [])
}
