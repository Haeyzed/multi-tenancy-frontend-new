"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getInvoiceColumns } from "@/components/central/invoice/invoice-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { invoiceService } from "@/services/central/invoice.service"
import { useTenant } from "@/providers/central/tenant-provider"

export function InvoicesDataTable() {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getInvoiceColumns(), [])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("invoice_number", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const statusFilter = toCommaSeparatedFilter(status) ?? ""

  const invoicesQuery = useQuery({
    queryKey: queryKeys.invoices.list({
      page,
      perPage,
      search,
      status: statusFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      invoiceService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        status: toCommaSeparatedFilter(status),
      }),
  })

  const invoices = invoicesQuery.data?.data ?? []
  const pageCount = invoicesQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: invoices,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["invoice_number"], right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (invoicesQuery.isLoading) {
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
