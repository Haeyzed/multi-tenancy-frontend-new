"use client"

import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { getPermissionColumns } from "@/components/central/permission/permission-columns"
import { PermissionActionBar } from "@/components/central/permission/permission-action-bar"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { queryKeys } from "@/lib/central/query/keys"
import { permissionService } from "@/services/central/permission.service"
import type { Permission } from "@/types/central/permission"

interface PermissionsDataTableProps {
  onEdit: (permission: Permission) => void
}

export function PermissionsDataTable({ onEdit }: PermissionsDataTableProps) {
  const columns = React.useMemo(() => getPermissionColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("name", parseAsString.withDefault(""))

  const permissionsQuery = useQuery({
    queryKey: queryKeys.permissions.list({ page, perPage, search }),
    queryFn: () =>
      permissionService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
      }),
  })

  const permissions = permissionsQuery.data?.data ?? []
  const pageCount = permissionsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: permissions,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["select", "name"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (permissionsQuery.isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        filterCount={1}
        rowCount={perPage}
      />
    )
  }

  return (
    <div className="data-table-container">
      <DataTable
        table={table}
        actionBar={<PermissionActionBar table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
