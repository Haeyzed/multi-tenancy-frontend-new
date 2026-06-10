"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getHealthCheckColumns } from "@/components/central/health-check/health-check-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { healthCheckService } from "@/services/central/health-check.service"
import { useTenant } from "@/providers/central/tenant-provider"

export function HealthChecksDataTable() {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getHealthCheckColumns(), [])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("check_type", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const statusFilter = toCommaSeparatedFilter(status) ?? ""

  const healthChecksQuery = useQuery({
    queryKey: queryKeys.healthChecks.list({
      page,
      perPage,
      search,
      status: statusFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      healthCheckService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        status: toCommaSeparatedFilter(status),
      }),
  })

  const healthChecks = healthChecksQuery.data?.data ?? []
  const pageCount = healthChecksQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: healthChecks,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["check_type"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (healthChecksQuery.isLoading) {
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
