"use client"

import { useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { AnnouncementActionBar } from "@/components/central/announcement/announcement-action-bar"
import { getAnnouncementColumns } from "@/components/central/announcement/announcement-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import {
  FILTER_ARRAY_SEPARATOR,
  toCommaSeparatedFilter,
} from "@/lib/data-table/filter-params"
import { queryKeys } from "@/lib/central/query/keys"
import { announcementService } from "@/services/central/announcement.service"
import type { PlatformAnnouncement } from "@/types/central/announcement"

interface AnnouncementsDataTableProps {
  onEdit: (announcement: PlatformAnnouncement) => void
}

export function AnnouncementsDataTable({ onEdit }: AnnouncementsDataTableProps) {
  const columns = React.useMemo(() => getAnnouncementColumns({ onEdit }), [onEdit])

  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [search] = useQueryState("title", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )
  const [type] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )
  const [targetAudience] = useQueryState(
    "target_audience",
    parseAsArrayOf(parseAsString, FILTER_ARRAY_SEPARATOR).withDefault([]),
  )

  const isActiveFilter = toCommaSeparatedFilter(isActive) ?? ""
  const typeFilter = toCommaSeparatedFilter(type) ?? ""
  const targetAudienceFilter = toCommaSeparatedFilter(targetAudience) ?? ""

  const announcementsQuery = useQuery({
    queryKey: queryKeys.announcements.list({
      page,
      perPage,
      search,
      isActive: isActiveFilter,
      type: typeFilter,
      targetAudience: targetAudienceFilter,
    }),
    queryFn: () =>
      announcementService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        is_active: toCommaSeparatedFilter(isActive),
        type: toCommaSeparatedFilter(type),
        target_audience: toCommaSeparatedFilter(targetAudience),
      }),
  })

  const announcements = announcementsQuery.data?.data ?? []
  const pageCount = announcementsQuery.data?.meta.last_page ?? 0

  const { table } = useDataTable({
    data: announcements,
    columns,
    pageCount,
    initialState: {
      columnPinning: { left: ["select", "title"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (announcementsQuery.isLoading) {
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
      <DataTable
        table={table}
        actionBar={<AnnouncementActionBar table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
