"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { GitBranchIcon, TextIcon } from "lucide-react"
import * as React from "react"

import { ChangelogRowActions } from "@/components/central/changelog/changelog-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import {
  changelogPublishedFilterOptions,
  changelogTypeFilterOptions,
} from "@/lib/data-table/platform-filter-options"
import {
  changelogTypeLabels,
  type ChangelogType,
  type PlatformChangelog,
} from "@/types/central/changelog"

interface ChangelogColumnsOptions {
  onEdit: (entry: PlatformChangelog) => void
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

const typeVariant: Record<
  ChangelogType,
  "default" | "secondary" | "destructive" | "outline"
> = {
  feature: "default",
  fix: "secondary",
  breaking: "destructive",
  security: "destructive",
  performance: "outline",
}

export function getChangelogColumns({
  onEdit,
}: ChangelogColumnsOptions): ColumnDef<PlatformChangelog>[] {
  return [
    {
      id: "version",
      accessorKey: "version",
      header: ({ column }: { column: Column<PlatformChangelog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Version" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 font-medium">
          <GitBranchIcon className="size-4 text-muted-foreground" />
          {row.getValue("version")}
        </div>
      ),
      meta: {
        label: "Version",
        placeholder: "Search changelog...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }: { column: Column<PlatformChangelog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Title" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[280px] truncate" title={row.original.title}>
          {row.original.title}
        </span>
      ),
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }: { column: Column<PlatformChangelog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ row }) => {
        const type = row.original.type as ChangelogType

        return (
          <Badge variant={typeVariant[type] ?? "outline"}>
            {changelogTypeLabels[type] ?? type}
          </Badge>
        )
      },
      meta: {
        label: "Type",
        variant: "multiSelect",
        options: [...changelogTypeFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "is_published",
      accessorFn: (row) => (row.is_published ? "published" : "draft"),
      header: ({ column }: { column: Column<PlatformChangelog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.is_published ? "default" : "secondary"}>
          {row.original.is_published ? "Published" : "Draft"}
        </Badge>
      ),
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...changelogPublishedFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "published_at",
      accessorKey: "published_at",
      header: ({ column }: { column: Column<PlatformChangelog, unknown> }) => (
        <DataTableColumnHeader column={column} label="Published" />
      ),
      cell: ({ row }) => formatDate(row.original.published_at),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ChangelogRowActions entry={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
