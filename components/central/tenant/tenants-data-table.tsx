"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getTenantColumns } from "@/components/central/tenant/tenant-columns"
import { TenantActionBar } from "@/components/central/tenant/tenant-action-bar"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { tenantService } from "@/services/central/tenant.service"
import type { Tenant } from "@/types/central/tenant"
import { useTenant } from "@/providers/central/tenant-provider"

export function TenantsDataTable({
  onEdit,
}: {
  onEdit: (tenant: Tenant) => void
}) {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getTenantColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("name", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const statusFilter = toCommaSeparatedFilter(status) ?? ""

  const tenantsQuery = useQuery({
    queryKey: queryKeys.tenants.list({
      page,
      perPage,
      search,
      status: statusFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      tenantService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        status: toCommaSeparatedFilter(status),
      }),
  })

  const tenants = tenantsQuery.data?.data ?? []
  const pageCount = tenantsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: tenants,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["select", "name"], right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (tenantsQuery.isLoading) {
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
      <DataTable table={table} actionBar={<TenantActionBar table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
