"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { CategoryActionBar } from "@/components/tenant/category/category-action-bar"
import { getCategoryColumns } from "@/components/tenant/category/category-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { categoryService } from "@/services/tenant/category.service"
import type { Category } from "@/types/tenant/category"

interface CategoriesDataTableProps {
  onEdit: (category: Category) => void
}

export function CategoriesDataTable({ onEdit }: CategoriesDataTableProps) {
  const columns = React.useMemo(() => getCategoryColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("name", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )
  const [isFeatured] = useQueryState(
    "is_featured",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )
  const [showInMenu] = useQueryState(
    "show_in_menu",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const isActiveFilter = toCommaSeparatedFilter(isActive) ?? ""
  const isFeaturedFilter = toCommaSeparatedFilter(isFeatured) ?? ""
  const showInMenuFilter = toCommaSeparatedFilter(showInMenu) ?? ""

  const categoriesQuery = useQuery({
    queryKey: tenantQueryKeys.categories.list({
      page,
      perPage,
      search,
      isActive: isActiveFilter,
      isFeatured: isFeaturedFilter,
      showInMenu: showInMenuFilter,
    }),
    queryFn: () =>
      categoryService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        is_active: toCommaSeparatedFilter(isActive),
        is_featured: toCommaSeparatedFilter(isFeatured),
        show_in_menu: toCommaSeparatedFilter(showInMenu),
      }),
  })

  const categories = categoriesQuery.data?.data ?? []
  const pageCount = categoriesQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: categories,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["select", "name"], right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (categoriesQuery.isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        filterCount={4}
        rowCount={perPage}
      />
    )
  }

  return (
    <div className="data-table-container">
      <DataTable table={table} actionBar={<CategoryActionBar table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
