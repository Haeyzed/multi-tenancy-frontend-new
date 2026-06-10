"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getChangelogColumns } from "@/components/central/changelog/changelog-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { changelogService } from "@/services/central/changelog.service"
import type { PlatformChangelog } from "@/types/central/changelog"

interface ChangelogDataTableProps {
  onEdit: (entry: PlatformChangelog) => void
}

export function ChangelogDataTable({ onEdit }: ChangelogDataTableProps) {
  const columns = React.useMemo(() => getChangelogColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("version", parseAsString.withDefault(""))
  const [type] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )
  const [isPublished] = useQueryState(
    "is_published",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const typeFilter = toCommaSeparatedFilter(type) ?? ""
  const publishedFilter = toCommaSeparatedFilter(isPublished) ?? ""

  const changelogQuery = useQuery({
    queryKey: queryKeys.changelog.list({
      page,
      perPage,
      search,
      type: typeFilter,
      isPublished: publishedFilter,
    }),
    queryFn: () =>
      changelogService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        type: toCommaSeparatedFilter(type),
        is_published: toCommaSeparatedFilter(isPublished),
      }),
  })

  const entries = changelogQuery.data?.data ?? []
  const pageCount = changelogQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: entries,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["version"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (changelogQuery.isLoading) {
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
