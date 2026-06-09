"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getPaymentColumns } from "@/components/central/payment/payment-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { paymentService } from "@/services/central/payment.service"
import { useTenant } from "@/providers/central/tenant-provider"

export function PaymentsDataTable() {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getPaymentColumns(), [])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState(
    "provider_payment_id",
    parseAsString.withDefault(""),
  )
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const statusFilter = toCommaSeparatedFilter(status) ?? ""

  const paymentsQuery = useQuery({
    queryKey: queryKeys.payments.list({
      page,
      perPage,
      search,
      status: statusFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      paymentService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        status: toCommaSeparatedFilter(status),
      }),
  })

  const payments = paymentsQuery.data?.data ?? []
  const pageCount = paymentsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: payments,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["provider_payment_id"], right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (paymentsQuery.isLoading) {
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
