"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getTenantConfigColumns } from "@/components/central/tenant-config/tenant-config-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantConfigService } from "@/services/central/tenant-config.service"
import type { TenantConfig } from "@/types/central/tenant-config"
import { useTenant } from "@/providers/central/tenant-provider"

interface TenantConfigsDataTableProps {
  onEdit: (config: TenantConfig) => void
}

export function TenantConfigsDataTable({ onEdit }: TenantConfigsDataTableProps) {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(
    () => getTenantConfigColumns({ onEdit }),
    [onEdit],
  )

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("key", parseAsString.withDefault(""))

  const configsQuery = useQuery({
    queryKey: queryKeys.tenantConfigs.list({
      page,
      perPage,
      search,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      tenantConfigService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
      }),
  })

  const configs = configsQuery.data?.data ?? []
  const pageCount = configsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: configs,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["key"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (configsQuery.isLoading) {
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
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
