"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { ProductActionBar } from "@/components/tenant/product/product-action-bar"
import { getProductColumns } from "@/components/tenant/product/product-columns"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { productService } from "@/services/tenant/product.service"
import type { Product } from "@/types/tenant/product"

interface ProductsDataTableProps {
  onEdit: (product: Product) => void
}

export function ProductsDataTable({ onEdit }: ProductsDataTableProps) {
  const columns = React.useMemo(() => getProductColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("name", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const statusFilter = toCommaSeparatedFilter(status) ?? ""

  const productsQuery = useQuery({
    queryKey: tenantQueryKeys.products.list({
      page,
      perPage,
      search,
      status: statusFilter,
    }),
    queryFn: () =>
      productService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        status: toCommaSeparatedFilter(status),
      }),
  })

  const products = productsQuery.data?.data ?? []
  const pageCount = productsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: products,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["select", "name"], right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (productsQuery.isLoading) {
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
      <DataTable table={table} actionBar={<ProductActionBar table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
