"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import {
  ArchiveIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  PackageIcon,
  StarIcon,
  TextIcon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ProductRowActions } from "@/components/tenant/product/product-row-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getSelectAllCheckboxProps } from "@/lib/data-table/checkbox-utils"
import type { Product } from "@/types/tenant/product"

interface GetProductColumnsOptions {
  onEdit: (product: Product) => void
}

const productStatusFilterOptions = [
  { label: "Draft", value: "draft", icon: CircleDashedIcon },
  { label: "Active", value: "active", icon: CheckCircle2Icon },
  { label: "Archived", value: "archived", icon: ArchiveIcon },
  { label: "Discontinued", value: "discontinued", icon: XCircleIcon },
] as const

function formatPrice(value: string | null | undefined) {
  if (!value) {
    return "—"
  }

  const amount = Number.parseFloat(value)

  if (Number.isNaN(amount)) {
    return value
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function getProductColumns({
  onEdit,
}: GetProductColumnsOptions): ColumnDef<Product>[] {
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
      header: ({ column }: { column: Column<Product, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.getValue("name")}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.sku}
          </span>
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search products...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "brand",
      accessorFn: (row) => row.brand?.name ?? "—",
      header: ({ column }: { column: Column<Product, unknown> }) => (
        <DataTableColumnHeader column={column} label="Brand" />
      ),
      cell: ({ row }) => row.original.brand?.name ?? (
        <span className="text-muted-foreground">—</span>
      ),
    },
    {
      id: "category",
      accessorFn: (row) => row.category?.name ?? "—",
      header: ({ column }: { column: Column<Product, unknown> }) => (
        <DataTableColumnHeader column={column} label="Category" />
      ),
      cell: ({ row }) => row.original.category?.name ?? (
        <span className="text-muted-foreground">—</span>
      ),
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }: { column: Column<Product, unknown> }) => (
        <DataTableColumnHeader column={column} label="Price" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{formatPrice(row.original.price)}</span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }: { column: Column<Product, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.status === "active" ? <CheckCircle2Icon /> : null}
          {row.original.status}
        </Badge>
      ),
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...productStatusFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "is_featured",
      accessorFn: (row) => (row.is_featured ? "featured" : "standard"),
      header: ({ column }: { column: Column<Product, unknown> }) => (
        <DataTableColumnHeader column={column} label="Featured" />
      ),
      cell: ({ row }) =>
        row.original.is_featured ? (
          <Badge variant="outline">
            <StarIcon />
            Featured
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ProductRowActions product={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function useProductColumns(options: GetProductColumnsOptions) {
  return React.useMemo(() => getProductColumns(options), [options.onEdit])
}
