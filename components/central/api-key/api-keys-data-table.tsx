"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getApiKeyColumns } from "@/components/central/api-key/api-key-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { apiKeyService } from "@/services/central/api-key.service"
import type { ApiKey } from "@/types/central/api-key"
import { useTenant } from "@/providers/central/tenant-provider"

interface ApiKeysDataTableProps {
  onEdit: (apiKey: ApiKey) => void
}

export function ApiKeysDataTable({ onEdit }: ApiKeysDataTableProps) {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getApiKeyColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("name", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const isActiveFilter = toCommaSeparatedFilter(isActive) ?? ""

  const apiKeysQuery = useQuery({
    queryKey: queryKeys.apiKeys.list({
      page,
      perPage,
      search,
      isActive: isActiveFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      apiKeyService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        is_active: toCommaSeparatedFilter(isActive),
      }),
  })

  const apiKeys = apiKeysQuery.data?.data ?? []
  const pageCount = apiKeysQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: apiKeys,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["name"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (apiKeysQuery.isLoading) {
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
