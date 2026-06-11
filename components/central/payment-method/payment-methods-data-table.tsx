"use client"

import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { getPaymentMethodColumns } from "@/components/central/payment-method/payment-method-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { queryKeys } from "@/lib/central/query/keys"
import { paymentMethodService } from "@/services/central/payment-method.service"
import { useTenant } from "@/providers/central/tenant-provider"

export function PaymentMethodsDataTable() {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getPaymentMethodColumns(), [])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("search", parseAsString.withDefault(""))

  const methodsQuery = useQuery({
    queryKey: queryKeys.paymentMethods.list({
      page,
      perPage,
      search,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      paymentMethodService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
      }),
  })

  const methods = methodsQuery.data?.data ?? []
  const pageCount = methodsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: methods,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["tenant"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (methodsQuery.isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        filterCount={1}
        rowCount={perPage}
      />
    )
  }

  return (
    <DataTable table={table} toolbar={<DataTableToolbar table={table} />} />
  )
}
