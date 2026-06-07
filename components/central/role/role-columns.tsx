"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { KeyRoundIcon, ShieldIcon, TextIcon } from "lucide-react"
import * as React from "react"

import { RoleRowActions } from "@/components/central/role/role-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Role } from "@/types/central/role"

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

interface GetRoleColumnsOptions {
  onEdit: (role: Role) => void
}

export function getRoleColumns({
  onEdit,
}: GetRoleColumnsOptions): ColumnDef<Role>[] {
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
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }: { column: Column<Role, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium font-mono">
          <ShieldIcon className="size-4 text-muted-foreground" />
          {row.getValue("name")}
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search roles...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "guard_name",
      accessorKey: "guard_name",
      header: ({ column }: { column: Column<Role, unknown> }) => (
        <DataTableColumnHeader column={column} label="Guard" />
      ),
      cell: ({ cell }) => (
        <div className="flex items-center gap-1 font-mono text-sm">
          <KeyRoundIcon className="size-4 text-muted-foreground" />
          {cell.getValue<string>()}
        </div>
      ),
    },
    {
      id: "permissions",
      accessorFn: (row) => row.permissions?.length ?? 0,
      header: ({ column }: { column: Column<Role, unknown> }) => (
        <DataTableColumnHeader column={column} label="Permissions" />
      ),
      cell: ({ row }) => {
        const permissions = row.original.permissions ?? []

        if (permissions.length === 0) {
          return "—"
        }

        const visible = permissions.slice(0, 2)
        const remaining = permissions.length - visible.length

        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((permission) => (
              <Badge
                key={permission.id}
                variant="secondary"
                className="font-mono text-xs"
              >
                {permission.name}
              </Badge>
            ))}
            {remaining > 0 ? (
              <Badge variant="outline" className="text-xs">
                +{remaining} more
              </Badge>
            ) : null}
          </div>
        )
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }: { column: Column<Role, unknown> }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
    },
    {
      id: "actions",
      cell: ({ row }) => <RoleRowActions role={row.original} onEdit={onEdit} />,
      size: 32,
    },
  ]
}

export function useRoleColumns(options: GetRoleColumnsOptions) {
  return React.useMemo(() => getRoleColumns(options), [options.onEdit])
}
