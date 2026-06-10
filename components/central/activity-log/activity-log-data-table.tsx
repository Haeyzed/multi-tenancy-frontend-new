"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getActivityLogColumns } from "@/components/central/activity-log/activity-log-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { activityLogService } from "@/services/central/activity-log.service"

export function ActivityLogDataTable() {
  const columns = React.useMemo(() => getActivityLogColumns(), [])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("description", parseAsString.withDefault(""))
  const [event] = useQueryState(
    "event",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const eventFilter = toCommaSeparatedFilter(event) ?? ""

  const activitiesQuery = useQuery({
    queryKey: queryKeys.activityLog.list({
      page,
      perPage,
      search,
      logName: "",
      event: eventFilter,
    }),
    queryFn: () =>
      activityLogService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        event: toCommaSeparatedFilter(event),
      }),
  })

  const entries = activitiesQuery.data?.data ?? []
  const pageCount = activitiesQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: entries,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["description"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (activitiesQuery.isLoading) {
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
