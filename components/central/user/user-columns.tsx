"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  CheckCircle2Icon,
  MailIcon,
  ShieldIcon,
  TextIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"

import { UserRowActions } from "@/components/central/user/user-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  countUserPermissions,
  getUserPermissionNames,
  getUserRoleNames,
} from "@/lib/central/user/user-utils"
import type { User } from "@/types/central/user"

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

export function getUserColumns({
  onEdit,
}: {
  onEdit: (user: User) => void
}): ColumnDef<User>[] {
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
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium">
          <UserIcon className="size-4 text-muted-foreground" />
          {row.getValue("name")}
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search users...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ cell }) => (
        <div className="flex items-center gap-1">
          <MailIcon className="size-4 text-muted-foreground" />
          {cell.getValue<string>()}
        </div>
      ),
    },
    {
      id: "roles",
      accessorFn: (row) => getUserRoleNames(row).join(", ") || "—",
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} label="Roles" />
      ),
      cell: ({ row }) => {
        const roles = getUserRoleNames(row.original)

        if (roles.length === 0) {
          return "—"
        }

        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role) => (
              <Badge key={role} variant="outline" className="font-mono text-xs">
                <ShieldIcon />
                {role}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      id: "permissions",
      accessorFn: (row) => countUserPermissions(row),
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} label="Permissions" />
      ),
      cell: ({ row }) => {
        const permissions = getUserPermissionNames(row.original)

        if (permissions.length === 0) {
          return "—"
        }

        const visible = permissions.slice(0, 2)
        const remaining = permissions.length - visible.length

        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((permission) => (
              <Badge
                key={permission}
                variant="secondary"
                className="font-mono text-xs"
              >
                {permission}
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
      id: "is_active",
      accessorKey: "is_active",
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const isActive = cell.getValue<boolean>()

        return (
          <Badge variant="outline">
            {isActive ? (
              <>
                <CheckCircle2Icon />
                Active
              </>
            ) : (
              <>
                <XCircleIcon />
                Inactive
              </>
            )}
          </Badge>
        )
      },
    },
    {
      id: "email_verified_at",
      accessorKey: "email_verified_at",
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} label="Verified" />
      ),
      cell: ({ cell }) => {
        const verifiedAt = cell.getValue<string | null>()

        return verifiedAt ? (
          <Badge variant="outline">
            <CheckCircle2Icon />
            Verified
          </Badge>
        ) : (
          <span className="text-muted-foreground">Unverified</span>
        )
      },
    },
    {
      id: "last_login_at",
      accessorKey: "last_login_at",
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} label="Last Login" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <UserRowActions user={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function useUserColumns(onEdit: (user: User) => void) {
  return React.useMemo(() => getUserColumns({ onEdit }), [onEdit])
}
