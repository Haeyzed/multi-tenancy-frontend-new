"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  ExternalLinkIcon,
  TextIcon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { BrandLogoImage } from "@/components/tenant/brand/brand-logo-image"
import { BrandRowActions } from "@/components/tenant/brand/brand-row-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getSelectAllCheckboxProps } from "@/lib/data-table/checkbox-utils"
import { activeInactiveFilterOptions, trashedFilterOptions } from "@/lib/data-table/status-options"
import type { Brand } from "@/types/tenant/brand"

interface GetBrandColumnsOptions {
  onEdit: (brand: Brand) => void
}

export function getBrandColumns({
  onEdit,
}: GetBrandColumnsOptions): ColumnDef<Brand>[] {
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
      header: ({ column }: { column: Column<Brand, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => {
        const logoUrl = row.original.logo_media?.url

        return (
          <div className="flex items-center gap-3">
            <BrandLogoImage
              url={logoUrl}
              alt={row.original.name}
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
        placeholder: "Search brands...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "website_url",
      accessorKey: "website_url",
      header: ({ column }: { column: Column<Brand, unknown> }) => (
        <DataTableColumnHeader column={column} label="Website" />
      ),
      cell: ({ row }) => {
        const url = row.original.website_url

        if (!url) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm hover:underline"
          >
            <ExternalLinkIcon className="size-3.5" />
            {url.replace(/^https?:\/\//, "")}
          </a>
        )
      },
    },
    {
      id: "sort_order",
      accessorKey: "sort_order",
      header: ({ column }: { column: Column<Brand, unknown> }) => (
        <DataTableColumnHeader column={column} label="Sort order" />
      ),
      cell: ({ cell }) => (
        <span className="tabular-nums">{cell.getValue<number>()}</span>
      ),
    },
    {
      id: "is_active",
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      header: ({ column }: { column: Column<Brand, unknown> }) => (
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
        <BrandRowActions brand={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function useBrandColumns(options: GetBrandColumnsOptions) {
  return React.useMemo(() => getBrandColumns(options), [options.onEdit])
}
