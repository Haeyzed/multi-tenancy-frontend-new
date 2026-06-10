"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getUsageRecordColumns } from "@/components/central/usage-record/usage-record-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { usageRecordService } from "@/services/central/usage-record.service"
import type { UsageRecord } from "@/types/central/usage-record"
import { useTenant } from "@/providers/central/tenant-provider"

interface UsageRecordsDataTableProps {
  onEdit: (record: UsageRecord) => void
}

export function UsageRecordsDataTable({ onEdit }: UsageRecordsDataTableProps) {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(
    () => getUsageRecordColumns({ onEdit }),
    [onEdit],
  )

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("search", parseAsString.withDefault(""))
  const [metric] = useQueryState(
    "metric",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const metricFilter = toCommaSeparatedFilter(metric) ?? ""

  const recordsQuery = useQuery({
    queryKey: queryKeys.usageRecords.list({
      page,
      perPage,
      search,
      metric: metricFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      usageRecordService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        metric: toCommaSeparatedFilter(metric),
      }),
  })

  const records = recordsQuery.data?.data ?? []
  const pageCount = recordsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: records,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["search"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (recordsQuery.isLoading) {
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
