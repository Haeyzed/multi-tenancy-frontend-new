"use client"

import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { getSubscriptionColumns } from "@/components/central/subscription/subscription-columns"
import { SubscriptionActionBar } from "@/components/central/subscription/subscription-action-bar"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { queryKeys } from "@/lib/central/query/keys"
import { subscriptionService } from "@/services/central/subscription.service"
import { useTenant } from "@/providers/central/tenant-provider"

export function SubscriptionsDataTable() {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(() => getSubscriptionColumns(), [])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("status", parseAsString.withDefault(""))

  const subscriptionsQuery = useQuery({
    queryKey: queryKeys.subscriptions.list({
      page,
      perPage,
      search,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      subscriptionService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
      }),
  })

  const subscriptions = subscriptionsQuery.data?.data ?? []
  const pageCount = subscriptionsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: subscriptions,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["select", "tenant"], right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (subscriptionsQuery.isLoading) {
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
      <DataTable
        table={table}
        actionBar={<SubscriptionActionBar table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
