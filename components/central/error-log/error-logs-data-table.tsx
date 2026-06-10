"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getErrorLogColumns } from "@/components/central/error-log/error-log-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { errorLogService } from "@/services/central/error-log.service"
import { useTenant } from "@/providers/central/tenant-provider"

export function ErrorLogsDataTable() {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getErrorLogColumns(), [])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("message", parseAsString.withDefault(""))
  const [severity] = useQueryState(
    "severity",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )
  const [resolution] = useQueryState(
    "resolution",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const severityFilter = toCommaSeparatedFilter(severity) ?? ""
  const resolutionFilter = toCommaSeparatedFilter(resolution) ?? ""

  const errorLogsQuery = useQuery({
    queryKey: queryKeys.errorLogs.list({
      page,
      perPage,
      search,
      severity: severityFilter,
      resolution: resolutionFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      errorLogService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        severity: toCommaSeparatedFilter(severity),
        resolution: toCommaSeparatedFilter(resolution),
      }),
  })

  const errorLogs = errorLogsQuery.data?.data ?? []
  const pageCount = errorLogsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: errorLogs,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["message"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (errorLogsQuery.isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        filterCount={3}
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
