"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { FolderIcon, KeyRoundIcon, TextIcon } from "lucide-react"
import * as React from "react"

import { PermissionRowActions } from "@/components/central/permission/permission-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getSelectAllCheckboxProps } from "@/lib/data-table/checkbox-utils"
import type { Permission } from "@/types/central/permission"

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

interface GetPermissionColumnsOptions {
  onEdit: (permission: Permission) => void
}

export function getPermissionColumns({
  onEdit,
}: GetPermissionColumnsOptions): ColumnDef<Permission>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          {...getSelectAllCheckboxProps(table)}
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
      header: ({ column }: { column: Column<Permission, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium font-mono">
          <KeyRoundIcon className="size-4 text-muted-foreground" />
          {row.getValue("name")}
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search permissions...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "guard_name",
      accessorKey: "guard_name",
      header: ({ column }: { column: Column<Permission, unknown> }) => (
        <DataTableColumnHeader column={column} label="Guard" />
      ),
      cell: ({ cell }) => (
        <span className="font-mono text-sm">{cell.getValue<string>()}</span>
      ),
    },
    {
      id: "module",
      accessorKey: "module",
      header: ({ column }: { column: Column<Permission, unknown> }) => (
        <DataTableColumnHeader column={column} label="Module" />
      ),
      cell: ({ cell }) => {
        const module = cell.getValue<string | null>()

        if (!module) {
          return "—"
        }

        return (
          <Badge variant="outline" className="font-mono text-xs">
            <FolderIcon />
            {module}
          </Badge>
        )
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }: { column: Column<Permission, unknown> }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <PermissionRowActions permission={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function usePermissionColumns(options: GetPermissionColumnsOptions) {
  return React.useMemo(() => getPermissionColumns(options), [options.onEdit])
}
