"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  FolderTreeIcon,
  StarIcon,
  TextIcon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { CategoryMediaImage } from "@/components/tenant/category/category-media-image"
import { CategoryRowActions } from "@/components/tenant/category/category-row-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getSelectAllCheckboxProps } from "@/lib/data-table/checkbox-utils"
import { activeInactiveFilterOptions, trashedFilterOptions } from "@/lib/data-table/status-options"
import type { Category } from "@/types/tenant/category"

interface GetCategoryColumnsOptions {
  onEdit: (category: Category) => void
}

const featuredFilterOptions = [
  { label: "Featured", value: "featured", icon: StarIcon },
  { label: "Not featured", value: "unfeatured", icon: XCircleIcon },
] as const

const menuFilterOptions = [
  { label: "In menu", value: "in_menu", icon: CheckCircle2Icon },
  { label: "Hidden from menu", value: "hidden", icon: XCircleIcon },
] as const

export function getCategoryColumns({
  onEdit,
}: GetCategoryColumnsOptions): ColumnDef<Category>[] {
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
      id: "name",
      accessorKey: "name",
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => {
        const iconUrl = row.original.icon_media?.url

        return (
          <div className="flex items-center gap-3">
            <CategoryMediaImage
              url={iconUrl}
              alt={row.original.icon_media?.file_name ?? row.original.name}
              kind="icon"
              variant="table"
            />
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{row.getValue("name")}</span>
                {row.original.deleted_at ? (
                  <Badge variant="secondary">Trashed</Badge>
                ) : null}
              </div>
              {row.original.slug ? (
                <span className="font-mono text-xs text-muted-foreground">
                  {row.original.slug}
                </span>
              ) : null}
            </div>
          </div>
        )
      },
      meta: {
        label: "Name",
        placeholder: "Search categories...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "parent",
      accessorFn: (row) => row.parent?.name ?? "—",
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} label="Parent" />
      ),
      cell: ({ row }) => {
        const parentName = row.original.parent?.name

        return parentName ? (
          <span className="inline-flex items-center gap-1.5">
            <FolderTreeIcon className="size-3.5 text-muted-foreground" />
            {parentName}
          </span>
        ) : (
          <span className="text-muted-foreground">Root</span>
        )
      },
    },
    {
      id: "sort_order",
      accessorKey: "sort_order",
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} label="Sort order" />
      ),
      cell: ({ cell }) => (
        <span className="tabular-nums">{cell.getValue<number>()}</span>
      ),
    },
    {
      id: "is_active",
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.original.is_active

        return (
          <Badge variant="outline" className="capitalize">
            {isActive ? (
              <>
                <CheckCircle2Icon />
                Active
              </>
            ) : (
              <>
                <XCircleIcon />
                Inactive
              </>
            )}
          </Badge>
        )
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...activeInactiveFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "is_featured",
      accessorFn: (row) => (row.is_featured ? "featured" : "unfeatured"),
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} label="Featured" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.is_featured ? (
            <>
              <StarIcon />
              Featured
            </>
          ) : (
            "Standard"
          )}
        </Badge>
      ),
      meta: {
        label: "Featured",
        variant: "multiSelect",
        options: [...featuredFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "show_in_menu",
      accessorFn: (row) => (row.show_in_menu ? "in_menu" : "hidden"),
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} label="Menu" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.show_in_menu ? "In menu" : "Hidden"}
        </Badge>
      ),
      meta: {
        label: "Menu",
        variant: "multiSelect",
        options: [...menuFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "trashed",
      accessorFn: (row) => (row.deleted_at ? "only" : "without"),
      header: () => null,
      cell: () => null,
      meta: {
        label: "Trash",
        variant: "multiSelect",
        options: [...trashedFilterOptions],
      },
      enableColumnFilter: true,
      enableHiding: false,
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <CategoryRowActions category={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function useCategoryColumns(options: GetCategoryColumnsOptions) {
  return React.useMemo(() => getCategoryColumns(options), [options.onEdit])
}
