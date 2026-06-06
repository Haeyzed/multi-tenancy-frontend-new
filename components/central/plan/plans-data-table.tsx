"use client"

import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { getPlanColumns } from "@/components/central/plan/plan-columns"
import { PlanActionBar } from "@/components/central/plan/plan-action-bar"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { queryKeys } from "@/lib/central/query/keys"
import { planService } from "@/services/central/plan.service"
import type { Plan } from "@/types/central/plan"

interface PlansDataTableProps {
  onEdit: (plan: Plan) => void
}

export function PlansDataTable({ onEdit }: PlansDataTableProps) {
  const columns = React.useMemo(() => getPlanColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("name", parseAsString.withDefault(""))

  const plansQuery = useQuery({
    queryKey: queryKeys.plans.list({ page, perPage, search }),
    queryFn: () =>
      planService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
      }),
  })

  const plans = plansQuery.data?.data ?? []
  const pageCount = plansQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: plans,
    columns,
    pageCount,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (plansQuery.isLoading) {
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
      <DataTable table={table} actionBar={<PlanActionBar table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
