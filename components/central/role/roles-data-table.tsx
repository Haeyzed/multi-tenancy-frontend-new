"use client"

import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { getRoleColumns } from "@/components/central/role/role-columns"
import { RoleActionBar } from "@/components/central/role/role-action-bar"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { queryKeys } from "@/lib/central/query/keys"
import { roleService } from "@/services/central/role.service"
import type { Role } from "@/types/central/role"

interface RolesDataTableProps {
  onEdit: (role: Role) => void
}

export function RolesDataTable({ onEdit }: RolesDataTableProps) {
  const columns = React.useMemo(() => getRoleColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("name", parseAsString.withDefault(""))

  const rolesQuery = useQuery({
    queryKey: queryKeys.roles.list({ page, perPage, search }),
    queryFn: () =>
      roleService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
      }),
  })

  const roles = rolesQuery.data?.data ?? []
  const pageCount = rolesQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: roles,
    columns,
    pageCount,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (rolesQuery.isLoading) {
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
      <DataTable table={table} actionBar={<RoleActionBar table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
