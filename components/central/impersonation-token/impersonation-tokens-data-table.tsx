"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getImpersonationTokenColumns } from "@/components/central/impersonation-token/impersonation-token-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { impersonationTokenService } from "@/services/central/impersonation-token.service"
import { useTenant } from "@/providers/central/tenant-provider"

export function ImpersonationTokensDataTable() {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getImpersonationTokenColumns(), [])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("search", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const statusFilter = toCommaSeparatedFilter(status) ?? ""

  const tokensQuery = useQuery({
    queryKey: queryKeys.impersonationTokens.list({
      page,
      perPage,
      search,
      status: statusFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      impersonationTokenService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        status: toCommaSeparatedFilter(status),
      }),
  })

  const tokens = tokensQuery.data?.data ?? []
  const pageCount = tokensQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: tokens,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["search"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (tokensQuery.isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        filterCount={2}
        rowCount={perPage}
      />
    )
  }

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
