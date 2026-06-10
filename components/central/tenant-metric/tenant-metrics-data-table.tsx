"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getTenantMetricColumns } from "@/components/central/tenant-metric/tenant-metric-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantMetricService } from "@/services/central/tenant-metric.service"
import type { TenantMetric } from "@/types/central/tenant-metric"
import { useTenant } from "@/providers/central/tenant-provider"

interface TenantMetricsDataTableProps {
  onEdit: (metric: TenantMetric) => void
}

export function TenantMetricsDataTable({ onEdit }: TenantMetricsDataTableProps) {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(
    () => getTenantMetricColumns({ onEdit }),
    [onEdit],
  )

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("search", parseAsString.withDefault(""))

  const metricsQuery = useQuery({
    queryKey: queryKeys.tenantMetrics.list({
      page,
      perPage,
      search,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      tenantMetricService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
      }),
  })

  const metrics = metricsQuery.data?.data ?? []
  const pageCount = metricsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: metrics,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["search"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (metricsQuery.isLoading) {
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
