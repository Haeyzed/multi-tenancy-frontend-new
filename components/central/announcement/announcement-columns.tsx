"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  CalendarIcon,
  CheckCircle2Icon,
  MegaphoneIcon,
  TextIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"

import { formatAnnouncementSchedule } from "@/components/central/announcement/announcement-form-utils"
import { AnnouncementRowActions } from "@/components/central/announcement/announcement-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getSelectAllCheckboxProps } from "@/lib/data-table/checkbox-utils"
import {
  announcementAudienceFilterOptions,
  announcementTypeFilterOptions,
} from "@/lib/data-table/announcement-filter-options"
import { activeInactiveFilterOptions } from "@/lib/data-table/status-options"
import {
  announcementTargetAudienceLabels,
  announcementTypeLabels,
  type AnnouncementType,
  type PlatformAnnouncement,
} from "@/types/central/announcement"

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

function typeBadgeVariant(type: AnnouncementType) {
  switch (type) {
    case "alert":
      return "destructive" as const
    case "maintenance":
      return "secondary" as const
    case "feature":
      return "default" as const
    default:
      return "outline" as const
  }
}

interface GetAnnouncementColumnsOptions {
  onEdit: (announcement: PlatformAnnouncement) => void
}

export function getAnnouncementColumns({
  onEdit,
}: GetAnnouncementColumnsOptions): ColumnDef<PlatformAnnouncement>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          {...getSelectAllCheckboxProps(table)}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }: { column: Column<PlatformAnnouncement, unknown> }) => (
        <DataTableColumnHeader column={column} label="Title" />
      ),
      cell: ({ row }) => (
        <div className="flex max-w-sm flex-col gap-0.5">
          <div className="flex items-center gap-1 font-medium">
            <MegaphoneIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{row.getValue("title")}</span>
          </div>
          <span className="line-clamp-1 ps-5 text-xs text-muted-foreground">
            {row.original.body}
          </span>
        </div>
      ),
      meta: {
        label: "Title",
        placeholder: "Search announcements...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }: { column: Column<PlatformAnnouncement, unknown> }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ row }) => {
        const type = row.getValue<AnnouncementType>("type")

        return (
          <Badge variant={typeBadgeVariant(type)}>
            {announcementTypeLabels[type] ?? type}
          </Badge>
        )
      },
      meta: {
        label: "Type",
        variant: "multiSelect",
        options: [...announcementTypeFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "target_audience",
      accessorKey: "target_audience",
      header: ({ column }: { column: Column<PlatformAnnouncement, unknown> }) => (
        <DataTableColumnHeader column={column} label="Audience" />
      ),
      cell: ({ row }) => {
        const audience = row.original.target_audience
        const planNames =
          row.original.target_plan_names ??
          row.original.target_plans ??
          []

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-sm">
              <UsersIcon className="size-4 text-muted-foreground" />
              {announcementTargetAudienceLabels[audience] ?? audience}
            </div>
            {planNames.length > 0 ? (
              <span className="text-xs text-muted-foreground">
                {planNames.join(", ")}
              </span>
            ) : null}
          </div>
        )
      },
      meta: {
        label: "Audience",
        variant: "multiSelect",
        options: [...announcementAudienceFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "schedule",
      accessorFn: (row) =>
        formatAnnouncementSchedule(row.starts_at, row.ends_at),
      header: ({ column }: { column: Column<PlatformAnnouncement, unknown> }) => (
        <DataTableColumnHeader column={column} label="Schedule" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <CalendarIcon className="size-4 text-muted-foreground" />
          {formatAnnouncementSchedule(row.original.starts_at, row.original.ends_at)}
        </div>
      ),
    },
    {
      id: "is_active",
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      header: ({ column }: { column: Column<PlatformAnnouncement, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge variant="outline" className="capitalize text-emerald-600">
            <CheckCircle2Icon />
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="capitalize text-muted-foreground">
            <XCircleIcon />
            Inactive
          </Badge>
        ),
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...activeInactiveFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }: { column: Column<PlatformAnnouncement, unknown> }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <AnnouncementRowActions announcement={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function useAnnouncementColumns(options: GetAnnouncementColumnsOptions) {
  return React.useMemo(() => getAnnouncementColumns(options), [options.onEdit])
}
