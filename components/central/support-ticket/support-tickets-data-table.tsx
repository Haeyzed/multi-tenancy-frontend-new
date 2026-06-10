"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { getSupportTicketColumns } from "@/components/central/support-ticket/support-ticket-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { supportTicketService } from "@/services/central/support-ticket.service"
import type { SupportTicket } from "@/types/central/support-ticket"
import { useTenant } from "@/providers/central/tenant-provider"

interface SupportTicketsDataTableProps {
  onEdit: (ticket: SupportTicket) => void
  onAssign: (ticket: SupportTicket) => void
  onOpenConversation: (ticket: SupportTicket) => void
}

export function SupportTicketsDataTable({
  onEdit,
  onAssign,
  onOpenConversation,
}: SupportTicketsDataTableProps) {
  const { selectedTenantId } = useTenant()
  const columns = React.useMemo(
    () => getSupportTicketColumns({ onEdit, onAssign, onOpenConversation }),
    [onEdit, onAssign, onOpenConversation],
  )

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("subject", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )
  const [priority] = useQueryState(
    "priority",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )
  const [category] = useQueryState(
    "category",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const statusFilter = toCommaSeparatedFilter(status) ?? ""
  const priorityFilter = toCommaSeparatedFilter(priority) ?? ""
  const categoryFilter = toCommaSeparatedFilter(category) ?? ""

  const ticketsQuery = useQuery({
    queryKey: queryKeys.supportTickets.list({
      page,
      perPage,
      search,
      status: statusFilter,
      priority: priorityFilter,
      category: categoryFilter,
      tenantId: selectedTenantId,
    }),
    queryFn: () =>
      supportTicketService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        status: toCommaSeparatedFilter(status),
        priority: toCommaSeparatedFilter(priority),
        category: toCommaSeparatedFilter(category),
      }),
  })

  const tickets = ticketsQuery.data?.data ?? []
  const pageCount = ticketsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: tickets,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["subject"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (ticketsQuery.isLoading) {
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
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
