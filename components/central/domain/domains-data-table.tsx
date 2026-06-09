"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getDomainColumns } from "@/components/central/domain/domain-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { domainService } from "@/services/central/domain.service"
import type { Domain } from "@/types/central/domain"
import { useTenant } from "@/providers/central/tenant-provider"

interface DomainsDataTableProps {
  onEdit: (domain: Domain) => void
}

export function DomainsDataTable({ onEdit }: DomainsDataTableProps) {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getDomainColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("domain", parseAsString.withDefault(""))
  const [verified] = useQueryState(
    "verified",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const verifiedFilter = toCommaSeparatedFilter(verified) ?? ""

  const domainsQuery = useQuery({
    queryKey: queryKeys.domains.list({
      page,
      perPage,
      search,
      verified: verifiedFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      domainService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        verified: toCommaSeparatedFilter(verified),
      }),
  })

  const domains = domainsQuery.data?.data ?? []
  const pageCount = domainsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: domains,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["domain"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (domainsQuery.isLoading) {
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
