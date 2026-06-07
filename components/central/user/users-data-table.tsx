"use client"

import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { getUserColumns } from "@/components/central/user/user-columns"
import { UserActionBar } from "@/components/central/user/user-action-bar"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { queryKeys } from "@/lib/central/query/keys"
import { userService } from "@/services/central/user.service"
import type { User } from "@/types/central/user"

interface UsersDataTableProps {
  onEdit: (user: User) => void
}

export function UsersDataTable({ onEdit }: UsersDataTableProps) {
  const columns = React.useMemo(() => getUserColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("name", parseAsString.withDefault(""))

  const usersQuery = useQuery({
    queryKey: queryKeys.users.list({ page, perPage, search }),
    queryFn: () =>
      userService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
      }),
  })

  const users = usersQuery.data?.data ?? []
  const pageCount = usersQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: users,
    columns,
    pageCount,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (usersQuery.isLoading) {
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
      <DataTable table={table} actionBar={<UserActionBar table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
